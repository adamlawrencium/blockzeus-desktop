const sleep = require('sleep');
const Poloniex = require('poloniex-api-node');
// const TimeSeriesCache = require('../../utils/timeSeriesCache/cache'); // TODO

/**
 * This data access layer wraps retry and rate limiting functionality
 * around the 'poloniex-api-node' library.
 *
 * @class poloniexDAL
 */
class poloniexDAL {
  constructor() {
    this.cache = false; // TODO
    this.lastCall = Date.now();
    this.PERIOD = 14400;
    this.initializeCache();
  }

  // Route all public Poloniex API calls through here
  async public(apiCall, params) {
    let result;
    const poloPublic_ = new Poloniex({ socketTimeout: 5000 });
    console.log(`Making public Poloniex API request [${apiCall}, ${params}]`);
    if (Date.now() - this.lastCall < 170) { sleep.msleep(170); }
    for (let i = 0; i < 7; i++) { // retry functionality
      this.lastCall = Date.now();
      let done = false;
      try {
        if (apiCall === 'ticker') {
          result = await poloPublic_.returnTicker();
          done = true;
        } else if (apiCall === 'chartData') {
          if (params in this.cache) { // see if data is in our cache
            const currentTime = Date.now() / 1000;
            const lastIndex = (this.cache)[params].length - 1;
            const lastUpdate = (this.cache)[params][lastIndex].date + this.PERIOD;
            // Checking if theres been a update, if there hasn't just send cached data
            if (lastUpdate > currentTime) {
              result = this.cache[params];
              console.log('Sent cached data for ', params, '.');
            } else {
              // Otherwise, pull new data and push it to the cache
              result = await poloPublic_.returnChartData(
                params,
                this.PERIOD,
                1000000000,
                9999999999,
              );
              (this.cache)[params] = result;
              console.log('Updated data in cache for ', params, '.');
            }
          } else {
            // If data not in cache, pull the data through a API call
            //  and push it to the cache
            result = await poloPublic_.returnChartData(
              params,
              this.PERIOD,
              1000000000,
              9999999999,
            );
            (this.cache)[params] = result;
            console.log('Loaded new data in cache for ', params, '.');
          }
          done = true;
        } else {
          throw Error('BZ: Invalid API Call');
        }
      } catch (err) {
        console.log('Error happened, retrying...', err);
        sleep.msleep(300); // abide by rate limits and avoid nonce issue
      }
      if (done) {
        break;
      }
    }
    return result;
  }

  // Takes in a Poloniex instance with private permissions to user
  // Route all private Poloniex API calls through here
  async private(poloPrivate_, apiCall) {
    let result;
    console.log(`Making private Poloniex API request [${apiCall}]`);
    if (Date.now() - this.lastCall < 170) { sleep.msleep(170); }
    for (let i = 0; i < 7; i++) { // retry functionality
      this.lastCall = Date.now();
      let done = false;
      try {
        if (apiCall === 'balances') {
          result = await poloPrivate_.returnBalances();
          done = true;
        } else if (apiCall === 'completeBalances') {
          result = await poloPrivate_.returnCompleteBalances();
          done = true;
        } else if (apiCall === 'tradeHistory') {
          result = await poloPrivate_.returnMyTradeHistory('all', 1000000000, 9999999999);
          done = true;
        } else if (apiCall === 'depositsWithdrawals') {
          result = await poloPrivate_.returnDepositsWithdrawals(1000000000, 9999999999);
          done = true;
        } else {
          throw Error('BZ: Invalid API Call');
        }
      } catch (err) {
        if (err.message.includes('Invalid API')) { // Error: Poloniex error 403: Forbidden. Invalid API key/secret pair.
          console.log(err.message);
          throw new Error(err.message);
        } else if (err.message.includes('Nonce')) {
          console.log(err.message);
          sleep.msleep(300); // abide by rate limits and avoid nonce issue
        } else {
          console.log('### Other error: ', err);
        }
      }
      if (done) {
        break;
      }
    }
    return result;
  }

  // Creates an instance of Poloniex for private commands
  createPrivatePoloInstance(key, secret) {
    return (new Poloniex(key, secret, { socketTimeout: 5000 }));
  }

  // Create a fake dataset from the reasonable beginning of Polo time to Now
  createDummyUSDTData() {
    const dummyData = [];
    dummyData.push({
      date: 1409961600,
      close: 1,
    });
    for (let i = 1409961600; i < Math.round((new Date()).getTime() / 1000); i += this.PERIOD) {
      dummyData.push({
        date: i,
        close: i,
      });
    }
    return dummyData;
  }

  initializeCache() {
    // Initialization of 12 most common currencies for caching purposes
    this.common = ['USDT_BTC', 'USDT_XRP', 'USDT_ETH', 'USDT_ETC', 'USDT_LTC',
      'USDT_STR', 'USDT_BCH', 'USDT_ZEC', 'USDT_XMR', 'USDT_REP', 'USDT_NXT',
      'USDT_DASH'];
    this.cache = {};

    const poloPublic_ = new Poloniex({ socketTimeout: 5000 });
    for (let i = 0; i < this.common.length; i++) {
      poloPublic_.returnChartData(
        this.common[i],
        this.PERIOD,
        1000000000,
        9999999999,
      ).then((data) => {
        this.cache[this.common[i]] = data;
      });
    }
  }
}

module.exports = poloniexDAL;
