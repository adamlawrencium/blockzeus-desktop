const express = require('express');
const sleep = require('sleep');
// const DBPoloniex = require('../models/PoloniexData');
const Poloniex = require('poloniex-api-node');

const router = express.Router();


const key = 'GTTSHNIZ-V4EYK5K9-4QT6XXS8-EPGJ9G5F';
const secret = '4f7a16db0f85e7a6924228c0693c94a3572c18dca8ff2d2e1e1038e9d24dcd0f9847e55edb39685c69350c9536c9f0f26d5b70804415859bfb90408ae364c19d';

const poloniex = new Poloniex(key, secret);
// let polo;
const PERIOD = 86400;
// Initialize most commonly used data.
let USDT_BTC;
polo('chartData', 'USDT_BTC').then(data => USDT_BTC = data);

/*
"BTC_DASH": {
  "id": 24,
  "last": "0.04802523",
  "lowestAsk": "0.04802524",
  "highestBid": "0.04802523",
  "percentChange": "-0.16781788",
  "baseVolume": "1792.54829461",
  "quoteVolume": "34876.35427715",
  "isFrozen": "0",
  "high24hr": "0.05869352",
  "low24hr": "0.04607966"
}, ...
*/
router.get('/ticker', async (req, res) => {
  const ticker = await polo('ticker');
  res.json(ticker);
});

/*
{
  "1CR": "0.00000000",
  "ABY": "0.00000000",
  ...,
}
*/
router.get('/balances', async (req, res) => {
  const balances = await polo('balances');
  res.json(balances);
});

/*
{
  "ZEC": {
    "available": "0.06138262",
    "onOrders": "0.00000000",
    "btcValue": "0.00134144"
  }, ...
}
*/
router.get('/completeBalances', async (req, res) => {
  const completeBalances = await polo('completeBalances');
  res.json(completeBalances);
});

/*
[
  {
    "globalTradeID": 280277971,
    "tradeID": 14345849,
    "date": "2017-12-07 06:54:03",
    "type": "sell",
    "rate": "14001.00000007",
    "amount": "0.00003570",
    "total": "0.49983570"
  }, ...
]
one month periods
*/
router.get('/tradeHistory/:currencyPair', async (req, res) => {
  const tradeHistory = await polo('tradeHistory');
  res.json(tradeHistory);
});

/*
{
  "date": 1424361600,
  "high": 0.33,
  "low": 225,
  "open": 0.33,
  "close": 225,
  "volume": 0.999999,
  "quoteVolume": 0.00444444,
  "weightedAverage": 225
},
period: {300, 900, 1800, 7200, 14400, 86400}
*/
router.get('/chartData/:pair/:period', async (req, res) => {
  const chartData = await polo('chartData', req.params.pair);
  res.json(chartData);
});
router.get('/usdtBaseChartData/:pair', async (req, res) => {
  let chartData = await polo('chartData', req.params.pair);
  chartData = await convertChartDataToUSDTBase(req.params.pair, chartData);
  res.json(chartData);
});


/*
From a history all trades, create a portfolio
To create a proper a portfolio value history for a certain currency, we need two things:
1. timeline of deposits & withdrawals
2. timeline of buys & sells in ALL markets
3. value all the inflow/outflows against (BTC ->) USD
*/
router.get('/performance/', async (req, res) => {
  const tl = await createBuySellTimeline('BCH'); // create buy & sell timeline
  const depositWithdrawls = await createDepositWithdrawalTimeline('BCH'); // create deposit & withdrawal timeline
  const eventTimeline = tl.concat(depositWithdrawls).sort((a, b) => a[0] - b[0]);
  const portfolioPerformance = await createPortfolioValueTimeline(eventTimeline, 'BCH');
  res.json(portfolioPerformance);
});


// A TEST ROUTE
router.get('/test', async (req, res) => {
  console.log(USDT_BTC);
  res.json('hi');
});

/* Get dollar performance of every holding and sum them up
for all holdings:
1. timeline of deposits & withdrawals
2. timeline of buys & sells in ALL markets
3. value all the inflow/outflows against (BTC ->) USD
*/
router.get('/fullPerformance', async (req, res) => {
  // Get all historically owned currencies by looking at past buys/sells/deposits/withdrawals
  const [dw, bs, ticker] = await Promise.all([
    polo('depositsWithdrawals'),
    polo('tradeHistory'),
    polo('ticker'),
  ]);
  const hoc = await getHistoricallyOwnedCurrencies(dw, bs); // # depositswithdrawals, buys/sells
  let performances = [];
  for (let i = 0; i < 7; i++) {
    console.log('Creating Performance Timeline:', hoc[i]);
    const tl = createBuySellTimeline(hoc[i], bs); // create buy & sell timeline, # buys/sells
    const depositWithdrawls = createDepositWithdrawalTimeline(hoc[i], dw); // create deposit & withdrawal timeline # depositswithdrawals
    const eventTimeline = tl.concat(depositWithdrawls).sort((a, b) => a[0] - b[0]); // join and sort by date
    performances.push(createPortfolioValueTimeline(eventTimeline, hoc[i], ticker));
  }
  performances = await Promise.all(performances);
  const fullPerformance = {};
  for (let i = 0; i < 7; i++) {
    // console.log(performances[i]);
    fullPerformance[hoc[i]] = performances[i];
  }
  res.json(fullPerformance);
});


// Takes in event timeline [[timestamp, buy/sell/deposit/withdrawal, amount], ...]
// values events against another currency (USD)
async function createPortfolioValueTimeline(eventTimeline, currency, ticker) {
  let portfolioTimeline = [[1000000000, 0, 0, 0]];

  // see if there exists a USDT_Currency market
  // if not, see if BTC_Currency market exists, then convert it to USDT and run the following:
  let chartData;
  if (ticker[`USDT_${currency}`]) {
    chartData = await polo('chartData', `USDT_${currency}`);
  } else if (ticker[`BTC_${currency}`]) {
    chartData = await polo('chartData', `BTC_${currency}`);
    chartData = await convertChartDataToUSDTBase(`BTC_${currency}`, chartData, ticker);
  } else if (currency === 'USDT') {
    chartData = createDummyUSDTData();
  }

  for (let i = 1; i < chartData.length; i++) {
    let intraPeriodPortfolioChange = 0;
    for (let eventIndex = 0; eventIndex < eventTimeline.length; eventIndex++) {
      // if the event is between two candlesticks, get final value
      if (eventTimeline[eventIndex][0] > chartData[i - 1].date &&
        eventTimeline[eventIndex][0] <= chartData[i].date) { // correct
        // if buy or deposit, add to portfolio, if sell or withdraw, substract
        if (eventTimeline[eventIndex][1] === 'deposit' ||
          eventTimeline[eventIndex][1] === 'buy') {
          intraPeriodPortfolioChange += eventTimeline[eventIndex][2];
        } else {
          intraPeriodPortfolioChange -= eventTimeline[eventIndex][2];
        }
      }
    }
    const ts = chartData[i - 1].date * 1000;
    const price = currency === 'USDT' ? 1 : chartData[i - 1].close;
    const quantity = portfolioTimeline[i - 1][2] + intraPeriodPortfolioChange;
    const value = price * quantity;
    portfolioTimeline.push([ts, price, quantity, parseFloat(value.toFixed(2))]);
  }

  if (currency === 'LTC') {
    console.log(eventTimeline);
  }
  // trim beginning data with no trading activity
  for (let i = 0; i < portfolioTimeline.length; i++) {
    if (portfolioTimeline[i][2] !== 0) {
      if (currency === 'LTC') {
        console.log(portfolioTimeline[i]);
      }
      portfolioTimeline = portfolioTimeline.slice(i, portfolioTimeline.length);
      break;
    }
  }
  return portfolioTimeline;
}

async function getHistoricallyOwnedCurrencies(dw, bs) {
  let hoc = [];
  // Add deposits and withdrawals
  for (let i = 0; i < dw.deposits.length; i++) {
    hoc.push(dw.deposits[i].currency);
  }
  if (dw.withdrawals) {
    for (let i = 0; i < dw.withdrawals.length; i++) {
      hoc.push(dw.withdrawals[i].currency);
    }
  }
  // Add buys and sells
  Object.keys(bs).forEach((entry) => {
    hoc.push(entry.split('_')[0]);
    hoc.push(entry.split('_')[1]);
  });
  hoc = Array.from(new Set(hoc));
  return hoc;
}

function createDepositWithdrawalTimeline(currency, dw) {
  const depositWithdrawaltimeline = [];
  for (let i = 0; i < dw.deposits.length; i++) {
    if (dw.deposits[i].currency === currency || currency === 'all') {
      const ts = dw.deposits[i].timestamp;
      const event = 'deposit';
      const amount = parseFloat(dw.deposits[i].amount);
      depositWithdrawaltimeline.push([ts, event, amount, dw.deposits[i].currency]);
    }
  }
  for (let i = 0; i < dw.withdrawals.length; i++) {
    if (dw.withdrawals[i].currency === currency || currency === 'all') {
      const ts = dw.withdrawals[i].timestamp;
      const event = 'withdrawal';
      const amount = parseFloat(dw.withdrawals[i].amount);
      depositWithdrawaltimeline.push([ts, event, amount, dw.withdrawals[i].currency]);
    }
  }
  return depositWithdrawaltimeline;
}

/*
Looks through all trades and creates buy/sell timeline based on all currency pairs
*/
function createBuySellTimeline(currency, bs) {
  const timeline = [];
  Object.keys(bs).forEach((pair) => {
    // if currency is base, sell orders add to portfolio, buy orders substract from portfolio
    // if currency is trade, sell orders subtract from portfolio, buy orders add to portfolio
    if (pair.split('_')[0] === currency) {
      // loop through all trades of specific pair
      for (let i = 0; i < bs[pair].length; i++) {
        const ts = Date.parse(bs[pair][i].date) / 1000;
        const event = bs[pair][i].type === 'buy' ? 'sell' : 'buy';
        const amount = parseFloat(bs[pair][i].total) * 0.9975;
        timeline.push([ts, event, amount, pair]);
      }
    } else if (pair.split('_')[1] === currency) {
      // loop through all trades of specific pair
      for (let i = 0; i < bs[pair].length; i++) {
        const ts = Date.parse(bs[pair][i].date) / 1000;
        const event = bs[pair][i].type === 'buy' ? 'buy' : 'sell';
        const amount = parseFloat(bs[pair][i].amount) * 0.9975;
        timeline.push([ts, event, amount, pair]);
      }
    }
  });
  return timeline;
}


// Takes in chartData and coverts the prices to a USDT base
async function convertChartDataToUSDTBase(pair, chartData_) {
  let chartData = chartData_;
  let usdtbase = [];
  if (pair.split('_')[0] === 'USDT') {
    return chartData;
  } else if (pair.split('_')[0] === 'BTC') {
    usdtbase = USDT_BTC;
  } else if (pair.split('_')[0] === 'ETH') {
    usdtbase = await polo('chartData', 'USDT_ETH');
  } else if (pair.split('_')[0] === 'XMR') {
    usdtbase = await polo('chartData', 'USDT_XMR');
  }
  // make arrays same length
  const cdlen = chartData.length; const usdtBtclen = usdtbase.length;
  if (usdtBtclen >= cdlen) {
    usdtbase = usdtbase.slice(usdtBtclen - cdlen, usdtBtclen);
  } else {
    chartData = chartData.slice(cdlen - usdtBtclen, cdlen);
  }

  const convertedChartData = [];
  for (let i = 0; i < usdtbase.length; i++) {
    convertedChartData.push({
      date: usdtbase[i].date,
      close: chartData[i].close * usdtbase[i].close,
    });
  }
  return convertedChartData;
}

// Create a fake dataset from the reasonable beginning of Polo time to Now
function createDummyUSDTData() {
  const dummyData = [];
  dummyData.push({
    date: 1409961600,
    close: 1,
  });
  for (let i = 1409961600; i < Math.round((new Date()).getTime() / 1000); i += PERIOD) {
    dummyData.push({
      date: i,
      close: i,
    });
  }
  return dummyData;
}

// Route all Poloniex API calls through here
async function polo(apiCall, params) {
  let res;
  console.log(`Making Poloniex API request [${apiCall}, ${params}]`);
  for (let i = 0; i < 7; i++) { // retry functionality
    let done = false;
    try {
      switch (apiCall) {
        case 'ticker':
          res = await poloniex.returnTicker();
          done = true;
          break;
        case 'chartData':
          res = await poloniex.returnChartData(params, PERIOD, 1000000000, 9999999999);
          console.log('Received', params, 'data.');
          done = true;
          break;
        case 'balances':
          res = await poloniex.returnBalances();
          done = true;
          break;
        case 'completeBalances':
          res = await poloniex.returnCompleteBalances();
          done = true;
          break;
        case 'tradeHistory':
          res = await poloniex.returnMyTradeHistory('all', 1000000000, 9999999999);
          done = true;
          break;
        case 'depositsWithdrawals':
          res = await poloniex.returnDepositsWithdrawals(1000000000, 9999999999);
          done = true;
          break;
        default:
          return 'BZ: Invalid API Call';
      }
    } catch (err) {
      console.log('Error happened, retrying...', err);
      sleep.msleep(300); // abide by rate limits and avoid nonce issue
    }
    if (done) break;
  }
  return res;
}

module.exports = router;
