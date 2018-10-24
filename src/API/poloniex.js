const PoloniexDAL = require('./poloniexDAL').default;
const poloniex = new PoloniexDAL();


const createAuthHeader = () => {
  let authToken = JSON.parse(localStorage.getItem('user')).token;
  if (!authToken) { authToken = 'DEMO'; }
  // console.log(authToken);
  return {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      authorization: `Bearer ${authToken}`,
    },
  };
};

const createDemoAuthHeader = () => {
  return {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      authorization: `Bearer DEMO`,
    },
  };
};

export async function fetchPoloniexTicker() {
  console.log('calling /poloniex/ticker');
  const ticker = await poloniex.public('ticker');
  console.log(ticker);
  return ticker;
  return new Promise(async (resolve, reject) => {

    fetch('/poloniex/ticker').then((res) => {
      if (!res.ok) {
        reject(res);
      } else {
        res.json().then((data) => {
          resolve(data);
        });
      }
    });
  });
}

export async function fetchPoloniexCompleteBalances() {
  console.log('calling /poloniex/completeBalances');
  // const p = (new Poloniex('GTTSHNIZ-V4EYK5K9-4QT6XXS8-EPGJ9G5F', '4f7a16db0f85e7a6924228c0693c94a3572c18dca8ff2d2e1e1038e9d24dcd0f9847e55edb39685c69350c9536c9f0f26d5b70804415859bfb90408ae364c19d', { socketTimeout: 5000 }));
  // const p = poloniex.createPrivatePoloInstance(res.locals.poloniexKey, res.locals.poloniexSecret);
  const p = poloniex.createPrivatePoloInstance('banana', 'bananasecret');
  const balances = await poloniex.private(p, 'completeBalances');
  console.log(balances);
  return balances;

  return new Promise((resolve, reject) => {
    fetch('/poloniex/completeBalances', createAuthHeader()).then((res) => {
      if (!res.ok) {
        reject(res);
      } else {
        res.json().then((data) => {
          const d = poloObjectToArray(data);
          resolve(d);
        });
      }
    });
  });
}

export function fetchDemoPoloniexCompleteBalances() {
  return;
  console.log('calling /poloniex/completeBalances');
  return new Promise((resolve, reject) => {
    fetch('/poloniex/completeBalances', createDemoAuthHeader()).then((res) => {
      if (!res.ok) {
        reject(res);
      } else {
        res.json().then((data) => {
          const d = poloObjectToArray(data);
          resolve(d);
        });
      }
    });
  });
}

export function fetchTradeHistory(pair) {
  console.log('calling /poloniex/tradeHistory');
  return;
  return new Promise((resolve, reject) => {
    fetch(`/poloniex/tradeHistory/${pair}`, createAuthHeader()).then((res) => {
      if (!res.ok) {
        reject(res);
      } else {
        res.json().then((data) => {
          resolve(data);
        });
      }
    });
  });
}

export function fetchPortfolioPerformance(pair) {
  return;
  return new Promise((resolve, reject) => {
    fetch('/poloniex/performance', createAuthHeader()).then((res) => {
      if (!res.ok) {
        reject(res);
      } else {
        res.json().then((data) => {
          resolve(data);
        });
      }
    });
  });
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


// Takes in chartData and coverts the prices to a USDT base
async function convertChartDataToUSDTBase(pair, chartData_) {
  let chartData = chartData_;
  let usdtbase = [];
  if (pair.split('_')[0] === 'USDT') {
    return chartData;
  } else if (pair.split('_')[0] === 'BTC') {
    usdtbase = await poloniex.public('chartData', 'USDT_BTC');
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

// // // // // // // // //
export async function fetchFullPortfolioPerformance() {
  const currency_limit = 8; // for graphing performance
  const p = poloniex.createPrivatePoloInstance('banana', 'bananasecret');
  const [dw, bs, ticker] = await Promise.all([
    poloniex.private(p, 'depositsWithdrawals'),
    poloniex.private(p, 'tradeHistory'),
    poloniex.public('ticker'),
  ]);
  const hoc = await parseHistoricallyOwnedCurrencies(dw, bs); // # depositswithdrawals, buys/sells
  let performances = [];
  for (let i = 0; i < currency_limit; i++) {
    console.log('Creating Performance Timeline:', hoc[i]);
    const tl = createBuySellTimeline(hoc[i], bs); // create buy & sell timeline, # buys/sells
    const depositWithdrawls = createDepositWithdrawalTimeline(hoc[i], dw); // create deposit & withdrawal timeline # depositswithdrawals
    const eventTimeline = tl.concat(depositWithdrawls).sort((a, b) => a[0] - b[0]); // join and sort by date
    performances.push(createPortfolioValueTimeline(eventTimeline, hoc[i], ticker));
  }
  performances = await Promise.all(performances);
  console.log('Total Volume:', totalVolume);
  const fullPerformance = {};
  for (let i = 0; i < currency_limit; i++) {
    // console.log(performances[i]);
    fullPerformance[hoc[i]] = performances[i];
  }
  return fullPerformance;
}

export async function fetchFullDemoPortfolioPerformance() {
  return;
  return new Promise(async (resolve, reject) => {
    fetch('poloniex/fullPerformance', createDemoAuthHeader()).then(async (res) => {
      if (res.ok) {
        resolve((await res.json()));
      } else {
        reject(res);
      }
    });
  });
}

export async function testPoloniexIntegration() {
  return;
  return new Promise(async (resolve, reject) => {
    fetch('poloniex/testIntegration', createAuthHeader()).then(async (res) => {
      if (res.ok) {
        const sampleData = await res.json();
        if (sampleData) {
          console.log(sampleData);
          resolve(true);
        }
      } else {
        reject(res.statusText);
      }
    });
  });
}

function poloObjectToArray(obj) {
  const a = [];
  for (const key in obj) {
    if (key === 'USDT') {
      a.push([key, parseFloat(obj[key].available)]);
    } else {
      a.push([key, parseFloat(obj[key].btcValue)]);
    }
  }
  return a;
}
