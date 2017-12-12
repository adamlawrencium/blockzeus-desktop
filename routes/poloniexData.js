var express = require('express');
var router = express.Router();

const Poloniex = require('poloniex-api-node');

let key = 'GTTSHNIZ-V4EYK5K9-4QT6XXS8-EPGJ9G5F'
let secret = '4f7a16db0f85e7a6924228c0693c94a3572c18dca8ff2d2e1e1038e9d24dcd0f9847e55edb39685c69350c9536c9f0f26d5b70804415859bfb90408ae364c19d'
let poloniex = new Poloniex(key, secret);


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
router.get('/ticker', function (req, res, next) {
  poloniex.returnTicker().then((ticker) => {
    res.json(ticker);
  }).catch((err) => {
    console.log(err.message);
    res.json(err)
  });
});

/*
{
  "1CR": "0.00000000",
  "ABY": "0.00000000",
  ...,
}
*/
router.get('/balances', function (req, res, next) {
  poloniex.returnBalances().then((balances) => {
    res.json(balances);
  }).catch((err) => {
    res.json(err)
    console.log(err.message);
  });
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
router.get('/completeBalances', function (req, res, next) {
  poloniex.returnCompleteBalances().then((balances) => {
    res.json(balances);
  }).catch((err) => {
    res.json(err)
    console.log(err.message);
  });
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
router.get('/tradeHistory/:currencyPair', function (req, res, next) {
  poloniex.returnMyTradeHistory(req.params.currencyPair, 1000000000, 9999999999).then((balances) => {
    console.log(balances)
    res.json(balances);
  }).catch((err) => {
    res.json(err.message)
    console.log(err.message);
  });
});


module.exports = router;
