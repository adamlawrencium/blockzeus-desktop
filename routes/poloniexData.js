var express = require('express');
var router = express.Router();
let sleep = require('sleep');
const DBPoloniex = require('../models/PoloniexData');

const Poloniex = require('poloniex-api-node');

let key = 'GTTSHNIZ-V4EYK5K9-4QT6XXS8-EPGJ9G5F'
let secret = '4f7a16db0f85e7a6924228c0693c94a3572c18dca8ff2d2e1e1038e9d24dcd0f9847e55edb39685c69350c9536c9f0f26d5b70804415859bfb90408ae364c19d'

let poloniex = new Poloniex(key, secret);

// Initialize most commonly used data.
let USDT_BTC;
polo('chartData', 'USDT_BTC').then(data => USDT_BTC = data)

let totalTraded = 0;

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
router.get('/ticker', async function (req, res, next) {
  let ticker = await polo('ticker');
  res.json(ticker);
});

/*
{
  "1CR": "0.00000000",
  "ABY": "0.00000000",
  ...,
}
*/
router.get('/balances', async function (req, res, next) {
  let balances = await polo('balances');
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
router.get('/completeBalances', async function (req, res, next) {
  let completeBalances = await polo('completeBalances');
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
router.get('/tradeHistory/:currencyPair', async function (req, res, next) {
  let tradeHistory = await polo('tradeHistory');
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
router.get('/chartData/:pair/:period', async function (req, res) {
  let chartData = await polo('chartData', req.params.pair);
  res.json(chartData);
});
router.get('/usdtBaseChartData/:pair', async function (req, res) {
  let chartData = await polo('chartData', req.params.pair);
  chartData = await convertChartDataToUSDTBase(req.params.pair, chartData);
  res.json(chartData)
})


/*
From a history all trades, create a portfolio
To create a proper a portfolio value history for a certain currency, we need two things:
1. timeline of deposits & withdrawals
2. timeline of buys & sells in ALL markets
3. value all the inflow/outflows against (BTC ->) USD
*/
router.get('/performance/', async function (req, res) {
  let tl = await createBuySellTimeline('BCH'); // create buy & sell timeline
  let depositWithdrawls = await createDepositWithdrawalTimeline('BCH'); // create deposit & withdrawal timeline
  let eventTimeline = tl.concat(depositWithdrawls).sort((a, b) => a[0] - b[0]); // join and sort by date
  let portfolioPerformance = await createPortfolioValueTimeline(eventTimeline, 'BCH');
  res.json(portfolioPerformance);
});


// A TEST ROUTE
router.get('/test', async function (req, res) {
  console.log(USDT_BTC);
  // res.json((await polo('chartData', 'USDT_BTC')));
  // DBPoloniex.find({ currencyPair: 'USDT_BTC' }, { 'date': 1, 'close': 1 }).sort({ date: -1 })
  //   .then(async (tickDataFromDB) => {
  //     res.json(tickDataFromDB)
  //   })
  //   .catch((err) => {
  //     reject_(err);
  //   });
});

async function getHistoricallyOwnedCurrencies(dw, bs) {
  let hoc = [];
  // Add deposits and withdrawals
  for (let i = 0; i < dw.deposits.length; i++) {
    hoc.push(dw.deposits[i].currency)
  }
  if (dw.withdrawals) {
    for (let i = 0; i < dw.withdrawals.length; i++) {
      hoc.push(dw.withdrawals[i].currency)
    }
  }
  // Add buys and sells
  for (let pair in bs) {
    hoc.push(pair.split('_')[0])
    hoc.push(pair.split('_')[1])
  }
  hoc = Array.from(new Set(hoc));
  return hoc;
}

function createUSDTValueTimeline(eventTimeline) {
  let portfolioTimeline = []
  for (let event in eventTimeline) {
    let ts = eventTimeline[event][0] * 1000;
    let price = 1;
    let quantity = eventTimeline[event][2];
    let value = price * quantity;
    portfolioTimeline.push([ts, price, quantity, parseFloat(value.toFixed(2))])
  }
  return portfolioTimeline;
}

/* Get dollar performance of every holding and sum them up
for all holdings:
  1. timeline of deposits & withdrawals
  2. timeline of buys & sells in ALL markets
  3. value all the inflow/outflows against (BTC ->) USD
*/
router.get('/fullPerformance', async function (req, res) {
  // Get all historically owned currencies by looking at past buys/sells/deposits/withdrawals
  const [dw, bs, ticker] = await Promise.all([polo('depositsWithdrawals'), polo('tradeHistory'), polo('ticker')]);
  let hoc = await getHistoricallyOwnedCurrencies(dw, bs); // # depositswithdrawals, buys/sells
  let performances = [];
  for (let i = 0; i < 6; i++) {
    console.log('Creating Performance Timeline:', hoc[i]);
    let tl = createBuySellTimeline(hoc[i], bs); // create buy & sell timeline, # buys/sells
    let depositWithdrawls = createDepositWithdrawalTimeline(hoc[i], dw); // create deposit & withdrawal timeline # depositswithdrawals
    let eventTimeline = tl.concat(depositWithdrawls).sort((a, b) => a[0] - b[0]); // join and sort by date
    performances.push(createPortfolioValueTimeline(eventTimeline, hoc[i], ticker));
  }
  performances = await Promise.all(performances);
  let fullPerformance = {}
  for (let i = 0; i < 6; i++) {
    fullPerformance[hoc[i]] = performances[i];
  }
  res.json(fullPerformance);
});


// Route all Poloniex API calls through here
async function polo(apiCall, params) {
  let res;
  console.log(`Making Poloniex API request [${apiCall}, ${params}]`);
  for (let i = 0; i < 3; i++) { // retry functionality
    let done = false;
    try {
      switch (apiCall) {
        case 'ticker':
          res = await poloniex.returnTicker();
          break;
        case 'chartData':
          res = await poloniex.returnChartData(params, 86400, 1000000000, 9999999999);
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
          return 'BZ: Invalid API Call'
          break;
      }
    } catch (err) {
      console.log('Error happened, retrying...', err);
      sleep.msleep(300); // abide by rate limits and avoid nonce issue
      continue;
    }
    if (done) break;
  }
  return res;
}

// Takes in chartData and coverts the prices to a USDT base
async function convertChartDataToUSDTBase(pair, chartData, ticker) {
  // let ticker = await polo('ticker');
  let convertedChartData = []
  let usdtbase = [];
  if (pair.split('_')[0] === 'USDT') {
    return chartData;
  }
  else if (pair.split('_')[0] === 'BTC') {
    usdtbase = USDT_BTC;
  }
  else if (pair.split('_')[0] === 'ETH') {
    usdtbase = await polo('chartData', 'USDT_ETH');
  }
  else if (pair.split('_')[0] === 'XMR') {
    usdtbase = await polo('chartData', 'USDT_XMR');
  }
  // make arrays same length
  let cdlen = chartData.length; let usdtBtclen = usdtbase.length;
  if (usdtBtclen >= cdlen) {
    usdtbase = usdtbase.slice(usdtBtclen - cdlen, usdtBtclen);
  } else {
    chartData = chartData.slice(cdlen - usdtBtclen, cdlen)
  }
  if (pair.split('_')[1] === 'GAS') {
  }
  for (let i = 0; i < usdtbase.length; i++) {
    convertedChartData.push({
      date: usdtbase[i].date,
      close: chartData[i].close * usdtbase[i].close
    });
  }
  return convertedChartData;
}

// Create a fake dataset from the reasonable beginning of Polo time to Now
function createDummyUSDTData() {
  let dummyData = [];
  dummyData.push({
    date: 1409961600,
    close: 1
  });
  for (let i = 1409961600; i < Math.round((new Date()).getTime() / 1000); i += 14400) {
    dummyData.push({
      date: i,
      close: i
    })
  }
  return dummyData;
}

// Takes in event timeline [[timestamp, buy/sell/deposit/withdrawal, amount], ...]
// values events against another currency (USD)
async function createPortfolioValueTimeline(eventTimeline, currency, ticker) {
  portfolioTimeline = [[1000000000, 0, 0, 0]];
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
      if (eventTimeline[eventIndex][0] > chartData[i - 1]['date'] &&
        eventTimeline[eventIndex][0] <= chartData[i]['date']) { //correct
        // if buy or deposit, add to portfolio, if sell or withdraw, substract
        if (eventTimeline[eventIndex][1] === 'deposit' ||
          eventTimeline[eventIndex][1] === 'buy') {
          intraPeriodPortfolioChange += eventTimeline[eventIndex][2];
        } else {
          intraPeriodPortfolioChange -= eventTimeline[eventIndex][2];
        }
      }
    }
    let ts = chartData[i - 1]['date'] * 1000;
    let price = currency === 'USDT' ? 1 : chartData[i - 1]['close']
    let quantity = portfolioTimeline[i - 1][2] + intraPeriodPortfolioChange
    let value = price * quantity;
    totalTraded += value - portfolioTimeline[i - 1][3];
    portfolioTimeline.push([ts, price, quantity, parseFloat(value.toFixed(2))])
  }

  // trim beginning data with no trading activity
  for (let i = 0; i < portfolioTimeline.length; i++) {
    if (portfolioTimeline[i][2] !== 0) {
      portfolioTimeline = portfolioTimeline.slice(i, portfolioTimeline.length);
      break;
    }
  }
  // console.log(portfolioTimeline);
  return portfolioTimeline;
}

function createDepositWithdrawalTimeline(currency, dw) {
  let depositWithdrawaltimeline = [];
  for (let i = 0; i < dw.deposits.length; i++) {
    if (dw.deposits[i].currency == currency || currency === 'all') {
      let ts = dw.deposits[i].timestamp;
      let event = 'deposit';
      let amount = parseFloat(dw.deposits[i].amount);
      depositWithdrawaltimeline.push([ts, event, amount, dw.deposits[i].currency]);
    }
  }
  for (let i = 0; i < dw.withdrawals.length; i++) {
    if (dw.withdrawals[i].currency == currency || currency === 'all') {
      let ts = dw.withdrawals[i].timestamp;
      let event = 'withdrawal';
      let amount = parseFloat(dw.withdrawals[i].amount);
      depositWithdrawaltimeline.push([ts, event, amount, dw.deposits[i].currency]);
    }
  }
  return depositWithdrawaltimeline;
}

/*
Looks through all trades and creates buy/sell timeline based on all currency pairs
*/
function createBuySellTimeline(currency, bs) {
  let timeline = [];
  for (let pair in bs) {
    // currency is base, sell orders add to portfolio, buy orders substract from portfolio
    if (pair.split("_")[0] === currency) {
      // loop through all trades of specific pair
      for (let i = 0; i < bs[pair].length; i++) {
        let ts = Date.parse(bs[pair][i].date) / 1000;
        let event = bs[pair][i].type === 'buy' ? 'sell' : 'buy';
        let amount = parseFloat(bs[pair][i].total) * 0.9975;
        timeline.push([ts, event, amount, pair])
      }
    }
    // currency is trade, sell orders subtract from portfolio, buy orders add to portfolio
    else if (pair.split("_")[1] === currency) {
      // loop through all trades of specific pair
      for (let i = 0; i < bs[pair].length; i++) {
        let ts = Date.parse(bs[pair][i].date) / 1000;
        let event = bs[pair][i].type === 'buy' ? 'buy' : 'sell';
        let amount = parseFloat(bs[pair][i].amount) * 0.9975;
        timeline.push([ts, event, amount, pair])
      }
    }
  }
  return timeline;
}

module.exports = router;
