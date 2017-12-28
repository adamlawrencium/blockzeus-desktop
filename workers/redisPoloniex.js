// This worker pushes data to a Heroku Redis cache

const Poloniex = require('poloniex-api-node');
const redis = require('redis');
const bluebird = require('bluebird');
const assert = require('assert');

process.on('unhandledRejection', r => console.log(r));

const poloniex = new Poloniex();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient('redis://h:p4595c78b0d2015e9fffd2b289e6cc6fb0caa800d1a8d26e3828a79465ae66883@ec2-35-168-41-119.compute-1.amazonaws.com:46939');

const INTERVAL = 14400;

// TODO Promise.all() this function
// Returns {USDT_BTC: [[t0, 3], [t1, 3.5], ...], ...}
async function poloPoller(pairs) {
  const updates = {};
  for (let i = 0; i < pairs.length; i++) {
    const data = await poloniex.returnChartData(pairs[i], INTERVAL, 1000000000, 9999999999);
    const compressed = [];
    console.log('Polo data length', data.length);
    data.forEach((element) => {
      const ts = element.date;
      const price = element.close;
      compressed.push([ts, price]);
    });
    updates[pairs[i]] = compressed;
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
  Object.keys(updates).forEach(async (pair) => {
    // Add each new [ts, price] to Redis
    // const updateCount = 0;
    let c = 0; const d = 0;
    console.log(updates[pair].length);
    const redisUpdates = [];

    updates[pair].forEach((pairData) => {
      c += 1
      const ts = pairData[0];
      const price = `${parseFloat(pairData[1]).toFixed(2)}:${ts}`;
      redisUpdates.push(client.zaddAsync(pair, ts, price));
    });
    await Promise.all(redisUpdates);
    console.log(c);
    // console.log('Updated', updateCount, 'kvs for', pair);
  });
}

// Loop through all popular pairs
// Check how up-to-date redis cache is
// Add new poloniex data accordingly
async function driver(pairs) {
  // await confirmDataUniformity('USDT_BTC');
  const updates = await poloPoller(pairs);
  await addToRedis(updates);
  await confirmDataUniformity('USDT_BTC');
  process.exit(1);
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// // // TESTING // // //
function queryRedis(pair) {
  return new Promise((resolve, reject) => {
    client.zrange(pair, 0, -1, 'WITHSCORES', (err, chartData) => {
      if (err) { reject(err); }
      console.log('Redis query length', chartData.length / 2);
      assert.equal(chartData.length % 2, 0); // make sure even number of Redis values
      const timeseries = [];
      for (let i = 0; i < chartData.length; i += 2) {
        const ts = parseFloat(chartData[i + 1]);
        const price = parseFloat(chartData[i].split(':')[0]);
        timeseries.push([ts, price]);
        // console.log(ts, price);
      }
      resolve(timeseries);
    });
  });
}

async function confirmDataUniformity(pair) {
  const timeseries = await queryRedis(pair);
  let notgood = 0;
  for (let i = 0; i < timeseries.length - 1; i++) {
    // console.log(timeseries[i][0], timeseries[i + 1][0]);
    if (timeseries[i][0] + INTERVAL !== timeseries[i + 1][0]) {
      notgood += 1;
      console.log(timeseries[i]);
    }
  }
  if (notgood) {
    console.log(notgood);
    throw new Error('Data is not uniform.', notgood, 'misforms');
  } else {
    console.log('Data is time uniform');
  }
}

// Consists of all USDT markets and top 10 BTC markets
// const popularPairs = ['USDT_BTC', 'USDT_ETH', 'BTC_XMR', 'BTC_XRP'];
const popularPairs = ['USDT_BTC'];
driver(popularPairs);
// confirmDataUniformity('USDT_BTC');

// client.del('USDT_BTC', redis.print);

