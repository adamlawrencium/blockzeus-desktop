export function fetchPoloniexTicker() {
  console.log('calling /poloniexData/ticker')
  return new Promise((resolve, reject) => {
    fetch('/poloniexData/ticker').then(res => {
      if (!res.ok) {
        reject(res);
      } else {
        res.json().then(data => {
          resolve(data);
        })
      }
    });
  });
}

export function fetchPoloniexCompleteBalances() {
  console.log('calling /poloniexData/completeBalances')
  return new Promise((resolve, reject) => {
    fetch('/poloniexData/completeBalances').then(res => {
      if (!res.ok) {
        reject(res);
      } else {
        res.json().then(data => {
          let d = poloObjectToArray(data).filter(x => x[1] > 0);
          resolve(d);
        })
      }
    })
  });
}

export function fetchTradeHistory(pair) {
  console.log('calling /poloniexData/tradeHistory')
  return new Promise((resolve, reject) => {
    fetch(`/poloniexData/tradeHistory/${pair}`).then(res => {
      if (!res.ok) {
        reject(res);
      } else {
        res.json().then(data => {
          resolve(data);
        });
      }
    });
  });
}

export function fetchPortfolioPerformance(pair) {
  return new Promise((resolve, reject) => {
    fetch('/poloniexData/performance').then(res => {
      if (!res.ok) {
        reject(res);
      } else {
        res.json().then(data => {
          resolve(data);
        });
      }
    });
  });
}

function poloObjectToArray(obj) {
  let a = [];
  for (let key in obj) {
    if (key === 'USDT') {
      a.push([key, parseFloat(obj[key]['available'])])
    } else {
      a.push([key, parseFloat(obj[key]['btcValue'])])
    }
  }
  return a;
}