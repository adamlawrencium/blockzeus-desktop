const jsonfile = require('jsonfile');
const Poloniex = require('poloniex-api-node');

const poloniex = new Poloniex();
// const sleep = require('sleep');

poloniex.returnChartData('BTC_XMR', 86400, 1000000000, 9999999999).then((d) => {
  const data = d;
  // console.log(d);
  const compressed = [];
  data.forEach((element) => {
    compressed.push([element.date, element.close]);
  });
  console.log(compressed);
  jsonfile.writeFile('btc_xmr_compressed_86400.json', compressed, (err) => {
  if (err) { console.error('ERROR', err); } else { console.log('Wrote btc_xmr_compressed data successfully.'); }
  });
}).catch((err) => { console.log(err); });


// poloniex.returnTicker().then((data) => {
//   const markets = Object.keys(data).sort();
//   for (let i = 0; i < Math.floor(markets.length / 2); i++) {
//     sleep.msleep(300);
//     console.log(markets[i]);
//     poloniex.returnChartData(markets[i], 86400, 1000000000, 9999999999).then((d) => {
//       jsonfile.writeFile(`${markets[i]}-86400.json`, d, (err) => {
//         if (err) { console.error('ERROR', err); } else { console.log('Wrote', markets[i], 'data successfully.'); }
//       });
//     }).catch((err) => { console.log(markets[i], err); });
//   }

//   console.log(markets);
//   for (let i = Math.floor(markets.length / 2); i < markets.length; i++) {
//     sleep.msleep(300);
//     console.log('market:', i, markets[i]);
//     poloniex.returnChartData(markets[i], 86400, 1000000000, 9999999999).then((d) => {
//       jsonfile.writeFile(`${markets[i]}-86400.json`, d, (err) => {
//         if (err) { console.error('ERROR', err); } else { console.log('Wrote', markets[i], 'data successfully.'); }
//       });
//     }).catch((err) => { console.log(markets[i], err); });
//   }
// });

