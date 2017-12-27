// This worker pushes data to a Heroku Redis cache

const Poloniex = require('poloniex-api-node');
const redis = require('redis');
const bluebird = require('bluebird');

const poloniex = new Poloniex();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient('redis://h:p4595c78b0d2015e9fffd2b289e6cc6fb0caa800d1a8d26e3828a79465ae66883@ec2-35-168-41-119.compute-1.amazonaws.com:46939');

process.on('unhandledRejection', r => console.log(r));

// poloniex.returnChartData('BTC_XMR', 86400, 1000000000, 9999999999)
//   .then((d) => {
//     const data = d;
//     const compressed = [];
//     data.forEach((element) => {
//       compressed.push([element.date, element.close]);
//     });
//     console.log(compressed);
//   })
//   .catch((err) => { console.log(err); });


// client.getAsync('foo').then((res) => {
//   console.log(res); // => 'bar'
// });

// client.set('string key', 'string val', redis.print);
// client.hset('hash key', 'hashtest 1', 'some value', redis.print);
// client.hset(['hash key', 'hashtest 2', 'some other value'], redis.print);
// client.hkeys('hash key', (err, replies) => {
//   console.log(`${replies.length} replies:`);
//   replies.forEach((reply, i) => {
//     console.log(`    ${i}: ${reply}`);
//   });
//   client.quit();
// });
async function poloPoller(pairs) {
  const updates = {};
  for (let i = 0; i < pairs.length; i++) {
    console.log('calling polo');
    const data = await poloniex.returnChartData(pairs[i], 86400, 1000000000, 9999999999);
    console.log('received polo');
    const compressed = [];
    data.forEach((element) => {
      client.zadd(pairs[i], element.date, element.close, redis.print);
      compressed.push([element.date, element.close]);
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
  Object.keys(updates).forEach((pair) => {
    const n = JSON.stringify(updates[pair]);
    // let p = JSON.parse(n);
    console.log(n);
    client.set(pair, n, redis.print);
  });
}

async function allKeysFromRedis() {
  client.get('USDT_BTC', (err, data) => {
    console.log(data);
  });
}

// loop through all popular pairs
// check how up-to-date redis cache is
// add new poloniex data accordingly
async function driver(pairs) {
  const updates = await poloPoller(pairs);
  // addToRedis(updates);
  // allKeysFromRedis();
}

// Consists of all USDT markets and top 10 BTC markets
// const popularPairs = ['USDT_BTC', 'USDT_ETH', 'BTC_XMR', 'BTC_XRP'];
const popularPairs = ['USDT_BTC'];

// driver(popularPairs);

// client.hmset('testpairlist', [
//   [100, 1000],
//   [101, 1001],
//   [102, 1002],
// ], redis.print);

// client.hgetall('testpairlist', (err, data) => {
//   console.log(data);
// });

// client.zadd('mysortedset', 100, 40, redis.print);
// client.zadd('mysortedset', 101, 40.3, redis.print);
// client.zadd('mysortedset', 102, 42.7, redis.print);
// client.zadd('mysortedset', 103, 22, redis.print);
client.zrange('USDT_BTC', 0, -1, 'WITHSCORES', (err, data) => {
  console.log(data);
});

// client.keys('*', function (err, keys) {
//   if (err) return console.log(err);

//   for(var i = 0, len = keys.length; i < len; i++) {
//     console.log(keys[i]);
//   }
// }); 

// client.del('USDT_BTC', redis.print);

