// import { resolve } from "url";

export function fetchPoloniexTicker() {
  console.log('calling /poloniexData/ticker')
  return new Promise((resolve, reject) => {
    fetch('/poloniexData/ticker')
      .then(res => res.json())
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        console.log("ERR", err);
        reject(err)
      })
  })
}

export function fetchPoloniexCompleteBalances() {
  console.log('calling /poloniexData/completeBalances')
  return new Promise((resolve, reject) => {
    fetch('/poloniexData/completeBalances')
      .then(res => res.json())
      .then(balances => {
        balances = poloObjectToArray(balances).filter(b => b[1] > 0);
        console.log(balances);
        balances = balances.sort((i, j) => j[0] - i[0]);
        // console.log(balances)
        resolve(balances);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

export function fetchTradeHistory(pair) {
  console.log('calling /poloniexData/tradeHistory')
  return new Promise((resolve, reject) => {
    fetch(`/poloniexData/tradeHistory/${pair}`)
      .then(res => res.json())
      .then(history => {
        resolve(history);
      }).catch(err => {
        console.log(err)
      });
  });
}

function poloObjectToArray(obj) {
  let a = [];
  for (let key in obj) {
    // console.log(obj[key])
    if (key === 'USDT') {
      a.push([key, parseFloat(obj[key]['available'])])
    }
    else {
      a.push([key, parseFloat(obj[key]['btcValue'])])
    }
  }
  // console.log(a)
  return a;
}
