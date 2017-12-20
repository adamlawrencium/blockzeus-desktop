const DBPoloniex = require('../models/PoloniexData');

DBPoloniex.find({ currencyPair: 'USDT_BTC' }).sort({ date: -1 }).limit(1)
  .then(async (tickDataFromDB) => {
    console.log(tickDataFromDB);
  })
  .catch((err) => {
    reject_(err);
  });