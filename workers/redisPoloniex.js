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
      compressed.push([element.date, element.close]);
    });
    updates[pairs[i]] = compressed;
  }
  return updates;
}

async function addToRedis(updates) {

}

// loop through all popular pairs
// check how up-to-date redis cache is
// add new poloniex data accordingly
function driver(pairs) {
  const updates = poloPoller(pairs);

}

// Consists of all USDT markets and top 10 BTC markets
const popularPairs = ['USDT_BTC', 'USDT_ETH', 'BTC_XMR', 'BTC_XRP'];

driver(popularPairs);
