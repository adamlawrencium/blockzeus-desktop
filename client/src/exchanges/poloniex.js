// import { resolve } from "url";

export function fetchPoloniexTicker() {
  return new Promise((resolve, reject) => {
    fetch('/poloniexData/ticker')
      .then(res => res.json())
      .then(data => {
        resolve(data);
      });
  })
}

export function fetchPoloniexCompleteBalances() {
  return new Promise((resolve, reject) => {
    fetch('/poloniexData/completeBalances')
      .then(res => res.json())
      .then(balances => {
        balances = poloObjectToArray(balances).filter(b => b[1] > 0).sort((i, j) => j[1] - i[1])
        resolve(balances);
      });
  });
}

export function fetchTradeHistory(pair) {
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
    a.push([key, parseFloat(obj[key]['btcValue'])])
  }
  return a;
}
