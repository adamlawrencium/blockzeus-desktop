const cache = require('memory-cache');
const Poloniex = require('poloniex-api-node');

process.on('unhandledRejection', r => console.log(r));

const poloniex = new Poloniex();

const INTERVAL = 14400;

// TODO Promise.all() this function
// Returns {USDT_BTC: [[t0, 3], [t1, 3.5], ...], ...}
async function poloPoller(pairs) {
  const updates = {};
  for (let i = 0; i < pairs.length; i++) {
    const data = await poloniex.returnChartData(pairs[i], INTERVAL, 1000000000, 9999999999);
    
  }
  return updates;
}

// Get all currencies from ticker
// Add pairs to cache
function driver() {
  setInterval(() => {
    console.log('sup');
  }, 5000);
}

