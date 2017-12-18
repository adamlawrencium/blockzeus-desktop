var express = require('express');
var router = express.Router();
let sleep = require('sleep');

const Poloniex = require('poloniex-api-node');

let key = 'GTTSHNIZ-V4EYK5K9-4QT6XXS8-EPGJ9G5F'
let secret = '4f7a16db0f85e7a6924228c0693c94a3572c18dca8ff2d2e1e1038e9d24dcd0f9847e55edb39685c69350c9536c9f0f26d5b70804415859bfb90408ae364c19d'

let poloniex = new Poloniex(key, secret);

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
  let tl = await createBuySellTimeline('XRP'); // create buy & sell timeline
  let depositWithdrawls = await createDepositWithdrawalTimeline('XRP'); // create deposit & withdrawal timeline
  let eventTimeline = tl.concat(depositWithdrawls).sort((a, b) => a[0] - b[0]); // join and sort by date
  let portfolioPerformance = await createPortfolioValueTimeline(eventTimeline);
  res.json(portfolioPerformance);
});


/* Get dollar performance of every holding and sum them up
for all holdings:
  1. timeline of deposits & withdrawals
  2. timeline of buys & sells in ALL markets
  3. value all the inflow/outflows against (BTC ->) USD
*/
router.get('/fullPerformance', async function (req, res) {
  // Get all historically owned currencies by looking at past buys/sells/deposits/withdrawals
  let historicallyOwnedCurrencies = [];
  let depositsWithdrawals = await createDepositWithdrawalTimeline('all');

  // get historical data for each currency
  let allChartData = {}
  let allPairs = (await polo('ticker'));
  for (let i in depositsWithdrawals) {
    let currency = depositsWithdrawals[i][3];
    if (!allChartData[currency]) {  // if hasn't been added already
      if (allPairs['BTC_' + currency]) { // if bitcoin market exists
        allChartData[currency] = await polo('chartData', 'BTC_' + currency);
      }
      else if (allPairs['USDT_' + currency]) { // if bitcoin market exists
        allChartData[currency] = await polo('chartData', 'USDT_' + currency);
      }
    }
  }

  res.json(allChartData);

  // let [dsWs, bsSs] = await Promise.all([polo('depositsWithdrawals'), polo('tradeHistory')]);
  // if (dsWs.deposits) {historicallyOwnedCurrencies.push(dsWs.deposits.map(d => d.currency));}
  // if (dsWs.withdrawals) {historicallyOwnedCurrencies.push(dsWs.withdrawals.map(w => w.currency));}
  // // for (let pair in bsSs) {historicallyOwnedCurrencies.push(pair.split('_')[1])}
  // // historicallyOwnedCurrencies = Array.from(new Set(historicallyOwnedCurrencies));
  // res.json(historicallyOwnedCurrencies);
  // return;
  // let holdings = await polo('balances');
  // for (let holding in holdings) { 
  //   if (parseFloat(holdings[holding]) > 0) {
  //     console.log(holding);
  //     let buysellTimeline = await createBuySellTimeline(holding);
  //     let depositWithdrawals = await createDepositWithdrawalTimeline(holding);
  //     let eventTimeline = buysellTimeline.concat(depositWithdrawals);
  //     eventTimeline.sort((a,b) => a[0] - b[0]);
  //     res.json(eventTimeline)
  //     return;
  //     // now determine which candlestick we can value our event timeline against.
  //     // first try the USDT market, then try Bitcoin
  //   }
  // }
  // res.json('y0')
});


// Route all Poloniex API calls through here
async function polo(apiCall, params) {
  let res;
  // sleep.msleep(1000); // prevent nonce issue with Poloniex
  console.log(`Making Poloniex API request [${apiCall}]`);
  for (let i = 0; i < 3; i++) { // retry functionality
    try {
      switch (apiCall) {
        case 'ticker':
          res = await poloniex.returnTicker();
          break;
        case 'chartData':
          res = await poloniex.returnChartData(params, 86400, 1000000000, 9999999999)
          break;
        case 'balances':
          res = await poloniex.returnBalances();
          break;
        case 'completeBalances':
          res = await poloniex.returnCompleteBalances();
          break;
        case 'tradeHistory':
          res = await poloniex.returnMyTradeHistory('all', 1000000000, 9999999999);
          break;
        case 'depositsWithdrawals':
          res = await poloniex.returnDepositsWithdrawals(1000000000, 9999999999);
          break;
        default:
          return 'BZ: Invalid API Call'
          break;
      }
    } catch (err) {
      console.log('Error happened, retrying...', err);
      // throw (`Poloniex Error! [${apiCall}]:`, err);
      continue;
    }

  }
  return res;
}


async function convertChartDataToUSDTBase(pair, chartData) {
  let ticker = await polo('ticker');
  let convertedChartData = []
  let usdtbase = [];
  if (pair.split('_')[0] === 'USDT') {
    return chartData;
  }
  else if (pair.split('_')[0] === 'BTC') {
    usdtbase = await polo('chartData', 'USDT_BTC');
  }
  else if (pair.split('_')[0] === 'ETH') {
    usdtbase = await polo('chartData', 'USDT_ETH');
  }
  // make arrays same length
  let cdlen = chartData.length; let usdtBtclen = usdtbase.length;
  if (usdtBtclen >= cdlen) {
    usdtbase = usdtbase.slice(usdtBtclen - cdlen, cdlen);
  } else {
    chartData = chartData.slice(cdlen - usdtBtclen, cdlen)
  }
  for (let i = 0; i < usdtbase.length; i++) {
    convertedChartData.push([usdtbase[i].date, chartData[i].close * usdtbase[i].close]);
  }
  return convertedChartData;
}


// Takes in event timeline [[timestamp, buy/sell/deposit/withdrawal, amount], ...]
// values events against another currency (USD)
async function createPortfolioValueTimeline(eventTimeline) {
  portfolioTimeline = [[1000000000, 0, 0, 0]];
  let chartData = await polo('chartData', 'USDT_XRP');
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
    let ts = chartData[i - 1]['date']
    let price = chartData[i - 1]['close']
    let quantity = portfolioTimeline[i - 1][2] + intraPeriodPortfolioChange
    let value = price * quantity;
    portfolioTimeline.push([ts, price, quantity, parseFloat(value.toFixed(2))])
  }

  // trim beginning data with no trading activity
  for (let i = 0; i < portfolioTimeline.length; i++) {
    if (portfolioTimeline[i][2] !== 0) {
      portfolioTimeline = portfolioTimeline.slice(i, portfolioTimeline.length);
      break;
    }
  }
  return portfolioTimeline;
}

async function createDepositWithdrawalTimeline(currency) {
  let history = await polo('depositsWithdrawals');
  let depositWithdrawaltimeline = [];
  for (let i = 0; i < history.deposits.length; i++) {
    if (history.deposits[i].currency == currency || currency === 'all') {
      let ts = history.deposits[i].timestamp;
      let event = 'deposit';
      let amount = parseFloat(history.deposits[i].amount);
      depositWithdrawaltimeline.push([ts, event, amount, history.deposits[i].currency]);
    }
  }
  for (let i = 0; i < history.withdrawals.length; i++) {
    if (history.withdrawals[i].currency == currency || currency === 'all') {
      let ts = history.withdrawals[i].timestamp;
      let event = 'withdrawal';
      let amount = parseFloat(history.withdrawals[i].amount);
      depositWithdrawaltimeline.push([ts, event, amount, history.deposits[i].currency]);
    }
  }
  return depositWithdrawaltimeline;
}

/*
Looks through all trades and creates buy/sell timeline based on all currency pairs
*/
async function createBuySellTimeline(currency) {
  let myTradeHistory = await polo('tradeHistory');
  let timeline = [];
  for (let pair in myTradeHistory) {
    // currency is base, sell orders add to portfolio, buy orders substract from portfolio
    if (pair.split("_")[0] === currency) {
      // loop through all trades of specific pair
      for (let i = 0; i < myTradeHistory[pair].length; i++) {
        let ts = Date.parse(myTradeHistory[pair][i].date) / 1000;
        let event = myTradeHistory[pair][i].type === 'buy' ? 'sell' : 'buy';
        let amount = parseFloat(myTradeHistory[pair][i].total) * 0.9975;
        timeline.push([ts, event, amount, pair])
      }
    }
    // currency is trade, sell orders subtract from portfolio, buy orders add to portfolio
    else if (pair.split("_")[1] === currency) {
      // loop through all trades of specific pair
      for (let i = 0; i < myTradeHistory[pair].length; i++) {
        let ts = Date.parse(myTradeHistory[pair][i].date) / 1000;
        let event = myTradeHistory[pair][i].type === 'buy' ? 'buy' : 'sell';
        let amount = parseFloat(myTradeHistory[pair][i].amount) * 0.9975;
        timeline.push([ts, event, amount, pair])
      }
    }
  }
  return timeline;
}


module.exports = router;
