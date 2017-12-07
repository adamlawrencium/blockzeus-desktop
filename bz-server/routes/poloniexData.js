var express = require('express');
var router = express.Router();

const Poloniex = require('poloniex-api-node');

let poloniex = new Poloniex();
// 578VL4VN-4B6OMM8W-EO027CY7-Q4WW19UX
// 92c519ce968332168a9fe3b0b9be01dd78e64b7bdb5272bc0e3d6399ec776f3e90a6bdb1857ecdb0952fde4ebb6b02e8acaeb1f0d75095b64938ea8e81e36f58


router.get('/returnTicker', function(req, res, next) {
  poloniex.returnTicker().then((ticker) => {
    res.json(ticker);
    console.log(ticker);
  }).catch((err) => {
    console.log(err.message);
    res.json(err)
  });
});

module.exports = router;
