// This worker pushes data to a Heroku Redis cache

const Poloniex = require('poloniex-api-node');
const redis = require('redis');
const bluebird = require('bluebird');
const assert = require('assert');

const poloniex = new Poloniex();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient('redis://h:p4595c78b0d2015e9fffd2b289e6cc6fb0caa800d1a8d26e3828a79465ae66883@ec2-35-168-41-119.compute-1.amazonaws.com:46939');

process.on('unhandledRejection', r => console.log(r));

// TODO Promise.all() this function
// Returns {USDT_BTC: [[t0, 3], [t1, 3.5], ...], ...}
async function poloPoller(pairs) {
  const updates = {};
  for (let i = 0; i < pairs.length; i++) {
    console.log('calling polo');
    const data = await poloniex.returnChartData(pairs[i], 86400, 1000000000, 9999999999);
    console.log('received polo');
    const compressed = [];
    console.log(data.length);
    data.forEach((element) => {
      const ts = element.date;
      const price = element.close;
      // console.log(element);
      // parse only timestamp and price data
      compressed.push([ts, price]);
    });
    updates[pairs[i]] = compressed;
    // console.log(compressed.length);
  }
  return updates;
}

/*
Schema v0.1
PAIR: "[[UNIXTIMESTAMP, PRICE], [UNIXTIMESTAMP, PRICE], [UNIXTIMESTAMP, PRICE]]"
PAIR: "[[UNIXTIMESTAMP, PRICE], [UNIXTIMESTAMP, PRICE], [UNIXTIMESTAMP, PRICE]]"
*/
async function addToRedis(updates) {
  // Loop through all pairs
  Object.keys(updates).forEach((pair) => {
    // Add each new [ts, price] to Redis
    console.log(updates[pair].length);
    updates[pair].forEach((pairData) => {
      const ts = pairData[0];
      const price = parseFloat(pairData[1]).toFixed(2);
      // console.log(ts, price);
      client.zadd(pair, ts, price, (err, data) => {
        console.log(ts, price, err, data);
      });
    });
  });
}

// Loop through all popular pairs
// Check how up-to-date redis cache is
// Add new poloniex data accordingly
async function driver(pairs) {
  const updates = await poloPoller(pairs);
  addToRedis(updates);
}

// Consists of all USDT markets and top 10 BTC markets
// const popularPairs = ['USDT_BTC', 'USDT_ETH', 'BTC_XMR', 'BTC_XRP'];
const popularPairs = ['USDT_BTC'];
// driver(popularPairs);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// // // TESTING // // //
function confirmDataUniformity(pair) {
  client.zrange('USDT_BTC', 0, -1, 'WITHSCORES', (err, data) => {
    if (err) {
      throw Error(err);
    }
    const chartData = data.map(element => parseFloat(element));
    assert.equal(chartData.length % 2, 0); // make sure even number of Redis values
    const timeseries = [];
    for (let i = 0; i < chartData.length; i += 2) {
      const ts = chartData[i + 1];
      const price = chartData[i];
      timeseries.push([ts, price]);
    }
    console.log(timeseries.length);
    for (let i = 0; i < timeseries.length - 1; i++) {
      if (timeseries[i + 1][0] - timeseries[i][0] > 86400) {
        console.log('Missing value', (timeseries[i + 1][0] + timeseries[i][0]) / 2);
      }
    }
  });
}

confirmDataUniformity('USDT_BTC');


// client.del('USDT_BTC', redis.print);
