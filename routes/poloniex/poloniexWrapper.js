const jsonfile = require('jsonfile')
const Poloniex = require('poloniex-api-node');
let poloniex = new Poloniex();
let sleep = require('sleep');

poloniex.returnTicker().then(data => {
  let markets = Object.keys(data).sort();
  for (let i = 0; i < Math.floor(markets.length / 2); i++) {
    sleep.msleep(300);
    console.log(markets[i]);
    poloniex.returnChartData(markets[i], 86400, 1000000000, 9999999999).then(d => {
      jsonfile.writeFile(`${markets[i]}-86400.json`, d, function (err) {
        if (err) { console.error('ERROR', err) }
        else { console.log('Wrote', markets[i], 'data successfully.')}
      });
    }).catch(err => { console.log(markets[i], err) });
  }

  console.log(markets);
  for (let i = Math.floor(markets.length / 2); i < markets.length; i++) {
    sleep.msleep(300);
    console.log('market:', i, markets[i]);
    poloniex.returnChartData(markets[i], 86400, 1000000000, 9999999999).then(d => {
      jsonfile.writeFile(`${markets[i]}-86400.json`, d, function (err) {
        if (err) { console.error('ERROR', err) }
        else { console.log('Wrote', markets[i], 'data successfully.')}
      });
    }).catch(err => { console.log(markets[i], err) });
  }
});


