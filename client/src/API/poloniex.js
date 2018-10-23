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
  // return new Promise(async (resolve, reject) => {

  //   fetch('/poloniex/ticker').then((res) => {
  //     if (!res.ok) {
  //       reject(res);
  //     } else {
  //       res.json().then((data) => {
  //         resolve(data);
  //       });
  //     }
  //   });
  // });
}

export async function fetchPoloniexCompleteBalances() {
  return;
  console.log('calling /poloniex/completeBalances');
  // const p = (new Poloniex('GTTSHNIZ-V4EYK5K9-4QT6XXS8-EPGJ9G5F', '4f7a16db0f85e7a6924228c0693c94a3572c18dca8ff2d2e1e1038e9d24dcd0f9847e55edb39685c69350c9536c9f0f26d5b70804415859bfb90408ae364c19d', { socketTimeout: 5000 }));
  // const p = poloniex.createPrivatePoloInstance(res.locals.poloniexKey, res.locals.poloniexSecret);
  const p = poloniex.createPrivatePoloInstance('GTTSHNIZ-V4EYK5K9-4QT6XXS8-EPGJ9G5F', '4f7a16db0f85e7a6924228c0693c94a3572c18dca8ff2d2e1e1038e9d24dcd0f9847e55edb39685c69350c9536c9f0f26d5b70804415859bfb90408ae364c19d', { nonce: () => new Date().time() });
  const balances = await poloniex.private(p, 'balances');
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

export async function fetchFullPortfolioPerformance() {
  return;
  return new Promise(async (resolve, reject) => {
    fetch('poloniex/fullPerformance', createAuthHeader()).then(async (res) => {
      if (res.ok) {
        resolve((await res.json()));
      } else {
        reject(res);
      }
    });
  });
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
