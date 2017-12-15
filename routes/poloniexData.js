var express = require('express');
var router = express.Router();

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
router.get('/ticker', function (req, res, next) {
  poloniex.returnTicker().then((ticker) => {
    res.json(ticker);
  }).catch((err) => {
    console.log('ERROR: /ticker:', err);
    res.json(err)
  });
});

/*
{
  "1CR": "0.00000000",
  "ABY": "0.00000000",
  ...,
}
*/
router.get('/balances', function (req, res, next) {
  poloniex.returnBalances().then((balances) => {
    res.json(balances);
  }).catch((err) => {
    res.json(err)
    console.log('ERROR: /balances:', err);
  });
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
router.get('/completeBalances', function (req, res, next) {
  poloniex.returnCompleteBalances().then((balances) => {
    res.json(balances);
  }).catch((err) => {
    res.json(err)
    console.log('ERROR: /completeBalances:', err);
  });
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
router.get('/tradeHistory/:currencyPair', function (req, res, next) {
  poloniex.returnMyTradeHistory(req.params.currencyPair, 1000000000, 9999999999).then((trades) => {
    res.json(trades);
  }).catch((err) => {
    res.json(err.message)
    console.log('ERROR: /tradeHistory:', err);
  });
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
router.get('/chartData/:currencyPair/:period', function (req, res) {
  poloniex.returnChartData(req.params.currencyPair, req.params.period, 1000000000, 9999999999).then(data => {
    res.json(data);
  }).catch(err => {
    res.json(err.message);
    console.log('ERROR: /chartData:', err);
  });
});


/*
From a history all trades, create a portfolio
*/
router.get('/performance/', async function (req, res) {
  let myTradeHistory = await poloniex.returnMyTradeHistory('USDT_BTC', 1000000000, 9999999999)
  let depositWithdrawalHistory = await poloniex.returnDepositsWithdrawals(1000000000, 9999999999)
  // console.log(myTradeHistory);
  let portfolio = {}
  portfolio['USDT_BTC'] = { 'trades': [], 'portfolioValue': [] };
  portfolio['USDT_BTC']['trades'] = myTradeHistory;
  portfolio['USDT_BTC']['events'] = []

  // determine timeline of events: [ [timestamp, event, amount], ... ]
  // loop through: buys & sells, deposits, withdrawals, 
  // add all events to array, then sort by timestamp
  for (let i = 0; i < myTradeHistory.length; i++) {
    let ts = Date.parse(myTradeHistory[i].date) / 1000;
    let event = myTradeHistory[i].type;
    let amount = parseFloat(myTradeHistory[i].amount);
    portfolio['USDT_BTC']['events'].push([ts, event, amount]);
  }
  for (let i = 0; i < depositWithdrawalHistory.deposits.length; i++) {
    if (depositWithdrawalHistory.deposits[i].currency == 'BTC') {
      let ts = depositWithdrawalHistory.deposits[i].timestamp;
      let event = 'deposit';
      let amount = parseFloat(depositWithdrawalHistory.deposits[i].amount);
      portfolio['USDT_BTC']['events'].push([ts, event, amount]);
    }
  }
  for (let i = 0; i < depositWithdrawalHistory.withdrawals.length; i++) {
    if (depositWithdrawalHistory.withdrawals[i].currency == 'BTC') {
      let ts = depositWithdrawalHistory.withdrawals[i].timestamp;
      let event = 'withdrawal';
      let amount = parseFloat(depositWithdrawalHistory.withdrawals[i].amount);
      portfolio['USDT_BTC']['events'].push([ts, event, amount]);
    }
  }

  portfolio['USDT_BTC']['events'].sort((a, b) => b[0] - a[0]);

  // loop through chartData and create portfolio value timeline
  // [timestamp, price, quantity, value]
  let portfolioTimeline = [[1000000000, 0, 0, 0]];

  let chartData = await poloniex.returnChartData('USDT_BTC', 86400, 1000000000, 9999999999);
  for (let i = 1; i < chartData.length; i++) {
    let intraPeriodPortfolioChange = 0;
    for (let eventIndex = 0; eventIndex < portfolio['USDT_BTC']['events'].length; eventIndex++) {
      // if the event is between two candlesticks, get final value
      if (portfolio['USDT_BTC']['events'][eventIndex][0] > chartData[i-1]['date'] &&
        portfolio['USDT_BTC']['events'][eventIndex][0] <= chartData[i]['date']) { //correct
        // if buy or deposit, add to portfolio, if sell or withdraw, substract
        if (portfolio['USDT_BTC']['events'][eventIndex][1] === 'deposit' ||
          portfolio['USDT_BTC']['events'][eventIndex][1] === 'buy') {
          intraPeriodPortfolioChange += portfolio['USDT_BTC']['events'][eventIndex][2];
        } else {
          intraPeriodPortfolioChange -= portfolio['USDT_BTC']['events'][eventIndex][2];
        }
      }
    }
    let ts = chartData[i-1]['date']
    let price = chartData[i-1]['close']
    let quantity = portfolioTimeline[i-1][2] + intraPeriodPortfolioChange
    let value = price * quantity;
    portfolioTimeline.push([ts, price, quantity, value])
  }

  res.json(portfolioTimeline);
});

module.exports = router;
