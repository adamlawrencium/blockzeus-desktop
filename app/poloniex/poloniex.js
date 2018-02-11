const express = require('express');
const PoloniexDAL = require('./poloniexDAL');

const poloniex = new PoloniexDAL();
const router = express.Router();

const PERIOD = 14400;
var lastCall = Date.now(); // used for poloniex rate limiting

// Initialize most commonly used data.
let USDT_BTC;
poloniex.public('chartData', 'USDT_BTC').then(data => USDT_BTC = data);

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
  const ticker = await poloniex.public('ticker');
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
  const p = poloniex.createPrivatePoloInstance();
  const balances = await poloniex.private(p, 'balances');
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
  const p = poloniex.createPrivatePoloInstance();
  const completeBalances = await poloniex.private(p, 'completeBalances');
  // Filter zero available balances
  Object.keys(completeBalances).forEach((balance) => {
    if (completeBalances[balance].available === '0.00000000') {
      delete completeBalances[balance];
    }
  });
  console.log(completeBalances);
  // Cache-Control response header
  // browser will cache this response for 60 seconds
  res.setHeader('Cache-Control', 'max-age=60')
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
  const p = poloniex.createPrivatePoloInstance();
  const tradeHistory = await poloniex.public(p, 'tradeHistory');
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
  const chartData = await poloniex.public('chartData', req.params.pair);
  res.json(chartData);
});
router.get('/usdtBaseChartData/:pair', async (req, res) => {
  let chartData = await poloniex.public('chartData', req.params.pair);
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

  const p = poloniex.createPrivatePoloInstance();

  const [dw, bs, ticker] = await Promise.all([
    poloniex.private(p, 'depositsWithdrawals'),
    poloniex.private(p, 'tradeHistory'),
    poloniex.public('ticker'),
  ]);
  const hoc = await parseHistoricallyOwnedCurrencies(dw, bs); // # depositswithdrawals, buys/sells
  let performances = [];
  for (let i = 0; i < 7; i++) {
    console.log('Creating Performance Timeline:', hoc[i]);
    const tl = createBuySellTimeline(hoc[i], bs); // create buy & sell timeline, # buys/sells
    const depositWithdrawls = createDepositWithdrawalTimeline(hoc[i], dw); // create deposit & withdrawal timeline # depositswithdrawals
    const eventTimeline = tl.concat(depositWithdrawls).sort((a, b) => a[0] - b[0]); // join and sort by date
    performances.push(createPortfolioValueTimeline(eventTimeline, hoc[i], ticker));
  }
  performances = await Promise.all(performances);
  console.log('Total Volume:', totalVolume);
  const fullPerformance = {};
  for (let i = 0; i < 7; i++) {
    // console.log(performances[i]);
    fullPerformance[hoc[i]] = performances[i];
  }
  // Cache-Control response header
  // browser will cache this response for 60 seconds
  res.setHeader('Cache-Control', 'max-age=60')
  res.json(fullPerformance);
});

var totalVolume = 0;
// Takes in event timeline [[timestamp, buy/sell/deposit/withdrawal, amount], ...]
// values events against another currency (USD)
async function createPortfolioValueTimeline(eventTimeline, currency, ticker) {
  let portfolioTimeline = [[1000000000, 0, 0, 0]];
  // see if there exists a USDT_Currency market
  // if not, see if BTC_Currency market exists, then convert it to USDT and run the following:
  let chartData;
  if (ticker[`USDT_${currency}`]) {
    chartData = await poloniex.public('chartData', `USDT_${currency}`);
  } else if (ticker[`BTC_${currency}`]) {
    chartData = await poloniex.public('chartData', `BTC_${currency}`);
    chartData = await convertChartDataToUSDTBase(`BTC_${currency}`, chartData, ticker);
  } else if (currency === 'USDT') {
    chartData = poloniex.createDummyUSDTData();
  }

  const userVolume = [];
  for (let i = 1; i < chartData.length; i++) {
    let intraPeriodPortfolioChange = 0;
    let intraVolume = 0;
    for (let eventIndex = 0; eventIndex < eventTimeline.length; eventIndex++) {
      // if the event is between two candlesticks, get final value
      if (eventTimeline[eventIndex][0] > chartData[i - 1].date &&
        eventTimeline[eventIndex][0] <= chartData[i].date) { // correct
        // if buy or deposit, add to portfolio, if sell or withdraw, substract
        if (eventTimeline[eventIndex][1] === 'deposit' ||
          eventTimeline[eventIndex][1] === 'buy') {
          intraVolume += eventTimeline[eventIndex][2];
          // console.log(eventTimeline[eventIndex][2]);
          intraPeriodPortfolioChange += eventTimeline[eventIndex][2];
        } else {
          intraVolume += eventTimeline[eventIndex][2];
          intraPeriodPortfolioChange -= eventTimeline[eventIndex][2];
          // console.log(eventTimeline[eventIndex][2]);
        }
      }
    }
    const ts = chartData[i - 1].date * 1000;
    const price = currency === 'USDT' ? 1 : parseFloat((chartData[i - 1].close).toFixed(2));
    if (intraVolume > 0) { userVolume.push(intraVolume * price); }
    const quantity = parseFloat((portfolioTimeline[i - 1][2] + intraPeriodPortfolioChange).toFixed(5));
    const value = (price * quantity) < 1.0 ? 0 : parseFloat((price * quantity).toFixed(2));
    portfolioTimeline.push([ts, price, quantity, value]);
  }
  totalVolume += sumArray(userVolume);
  // console.log(currency, totalVolume);
  // trim beginning data with no trading activity
  for (let i = 0; i < portfolioTimeline.length; i++) {
    if (portfolioTimeline[i][2] !== 0) {
      portfolioTimeline = portfolioTimeline.slice(i, portfolioTimeline.length);
      break;
    }
  }
  // if (totalVolume === 0) {
  //   return
  // }
  return portfolioTimeline;
}

async function parseHistoricallyOwnedCurrencies(dw, bs) {
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
    usdtbase = await poloniex.public('chartData', 'USDT_ETH');
  } else if (pair.split('_')[0] === 'XMR') {
    usdtbase = await poloniex.public('chartData', 'USDT_XMR');
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

function sumArray(arr) {
  let sum = 0;
  arr.forEach((element) => {
    sum += element;
  });
  return sum;
}

module.exports = router;
