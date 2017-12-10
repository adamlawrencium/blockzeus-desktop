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
  return new Promise((resolve, rejct) => {
    fetch('/poloniexData/completeBalances')
    .then(res => res.json())
    .then(balances => {
      balances = poloObjectToArray(balances).filter(b => b[1] > 0).sort((i, j) => j[1] - i[1])
      resolve(balances);
      // this.setState({ balances })
      // console.log(balances)
      // this.setState({ loaded: true })
    });
  });
}

function poloObjectToArray(obj) {
  let a = [];
  // let total = 0;
  for (let key in obj) {
    a.push([key, parseFloat(obj[key]['btcValue'])])
    // total += parseFloat(obj[key]['btcValue'])
  }
  // total = parseFloat(total.toFixed(8))
  // this.setState({ totalValue: total });
  return a;
}
