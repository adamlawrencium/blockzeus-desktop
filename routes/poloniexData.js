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

async function createDepositWithdrawalTimeline(currency) {
  let history = await poloniex.returnDepositsWithdrawals(1000000000, 9999999999)
  let depositWithdrawaltimeline = [];
  for (let i = 0; i < history.deposits.length; i++) {
    if (history.deposits[i].currency == currency) {
      let ts = history.deposits[i].timestamp;
      let event = 'deposit';
      let amount = parseFloat(history.deposits[i].amount);
      depositWithdrawaltimeline.push([ts, event, amount]);
    }
  }
  for (let i = 0; i < history.withdrawals.length; i++) {
    if (history.withdrawals[i].currency == currency) {
      let ts = history.withdrawals[i].timestamp;
      let event = 'withdrawal';
      let amount = parseFloat(history.withdrawals[i].amount);
      depositWithdrawaltimeline.push([ts, event, amount]);
    }
  }
  return depositWithdrawaltimeline;
}

/*
Looks through all trades and creates buy/sell timeline based on all currency pairs
*/
async function createBuySellTimeline(currency) {
  let myTradeHistory = (await poloniex.returnMyTradeHistory('all', 1000000000, 9999999999));
  let timeline = []
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

/*
From a history all trades, create a portfolio
To create a proper a portfolio value history for a certain currency, we need two things:
1. timeline of deposits & withdrawals
2. timeline of buys & sells in ALL markets
*/
router.get('/performance/', async function (req, res) {
  let tl = await createBuySellTimeline('XRP'); // create buy & sell timeline
  let depositWithdrawls = await createDepositWithdrawalTimeline('XRP'); // create deposit & withdrawal timeline
  let eventTimeline = tl.concat(depositWithdrawls).sort((a, b) => a[0] - b[0]); // join and sort by date

  portfolioTimeline = [[1000000000, 0, 0, 0]];
  let chartData = await poloniex.returnChartData('USDT_XRP', 1800, 1000000000, 9999999999);
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

  res.json(portfolioTimeline);
});

module.exports = router;
