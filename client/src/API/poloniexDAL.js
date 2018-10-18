// const sleep = require('sleep');
const Poloniex = require('poloniex-api-node');
console.log(Poloniex);
// const TimeSeriesCache = require('../../utils/timeSeriesCache/cache'); // TODO


export default class poloniexDAL {
  constructor() {
    this.cache = false;
    this.lastCall = Date.now();
    this.PERIOD = 14400;
  }

  // Route all public Poloniex API calls through here
  async public(apiCall, params) {
    let result;
    const poloPublic_ = new Poloniex({ socketTimeout: 5000 });
    console.log(`Making public Poloniex API request [${apiCall}, ${params}]`);
    // if (Date.now() - this.lastCall < 170) { sleep.msleep(170); }
    for (let i = 0; i < 7; i++) { // retry functionality
      this.lastCall = Date.now();
      let done = false;
      try {
        if (apiCall === 'ticker') {
          result = await poloPublic_.returnTicker();
          done = true;
        } else if (apiCall === 'chartData') {
          if (false) { // see if data is in our cache
            result = this.cache.get(params);
          } else {
            result = await poloPublic_.returnChartData(params, this.PERIOD, 1000000000, 9999999999);
            console.log('Received', params, 'data.');
          }
          done = true;
        } else {
          throw Error('BZ: Invalid API Call');
        }
      } catch (err) {
        console.log('Error happened, retrying...', err);
        // sleep.msleep(300); // abide by rate limits and avoid nonce issue
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
    // if (Date.now() - this.lastCall < 170) { sleep.msleep(170); }
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
          // sleep.msleep(300); // abide by rate limits and avoid nonce issue
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

}
