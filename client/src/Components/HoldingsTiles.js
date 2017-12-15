import React, { Component } from 'react';
import Tile from './Tile';

class HoldingsTiles extends Component {

  flattenTicker(ticker) {
    let tickcopy = Object.assign({}, ticker);
    let flattendTicker = []
    for (let tick in tickcopy) {
      let x = [tick, parseFloat(tickcopy[tick]['last']), parseFloat(tickcopy[tick]['percentChange'])];
      flattendTicker.push(x);
    }
    return flattendTicker;
  }


  // function modifies and holdings and adds on an additional 24change
  /*
  creates an array with:
  [currency, amount, usdPrice, usdValue, usdPriceChange]
  */
  createFullTileData(holdings_, ticker_) {

    // create copies of objects and filter non-holdings
    const tickcopy = Object.assign({}, ticker_);
    const holdcopy = Object.assign({}, holdings_);
    const flattendTicker = this.flattenTicker(tickcopy); // convert obj to array
    let tileData = flattendTicker.filter(tick => {
      for (let holding in holdcopy) {
        // assume a btc market exists for every non-btc market of the same trade currency
        if (holdcopy[holding][0] === tick[0].split('_')[1] && tick[0].split('_')[0] === 'BTC') {
          return true;
        }
      }
      return false
    });

    // Normalize all data to USD base.
    let btc_usd_rate = parseFloat(tickcopy['USDT_BTC']['last']);
    let btc_usd_rate_change = parseFloat(tickcopy['USDT_BTC']['percentChange']);
    let rateAdjustedTiles = []
    for (let holding in tileData) {
      let rate_to_usd_base = tileData[holding][1] * btc_usd_rate;
      let chng_to_usd_base = ((1 + tileData[holding][1]) * (1 + btc_usd_rate_change)).toFixed(2);
      rateAdjustedTiles.push([tileData[holding][0].split('_')[1], rate_to_usd_base.toFixed(4), chng_to_usd_base]);
    }

    // Manually handle usdt_btc and usdt case
    for (let i in holdcopy) {
      if (holdcopy[i][0] === 'BTC') {
        rateAdjustedTiles.push(["BTC", parseFloat(tickcopy["USDT_BTC"]["last"]).toFixed(2), parseFloat(tickcopy["USDT_BTC"]["percentChange"]).toFixed(2)]);
      }
      if (holdcopy[i][0] === 'USDT') {
        rateAdjustedTiles.push(['USDT', '1.00', '1.00']);
      }
    }

    for (let i = 0; i < rateAdjustedTiles.length; i++) {
      for (let holding in holdcopy) {
        console.log(rateAdjustedTiles[i][0]);
        console.log(holdcopy[holding]);
        if (rateAdjustedTiles[i][0] === holdcopy[holding][0]) {
          rateAdjustedTiles[i].push((holdcopy[holding][1]).toFixed(2))
        }
      }
    }

    console.log(rateAdjustedTiles);
    // this.setState({tiles: rateAdjustedTiles})
    return rateAdjustedTiles;
  }

  renderLoading() {
    return (
      <h2>Loading...</h2>
    )
  }

  renderTiles() {
    let holdings = this.createFullTileData(this.props.holdings, this.props.ticker);
    // holdings.map(holding => holding.push())
    return (
      <div className="row">
        {holdings.map(holding =>
          <Tile
            key={holding[0]}
            currency={(holding[0])}
            price={holding[1]}
            priceChange={holding[2]}
            value={holding[3]}
          />)}
      </div>
    )
  }

  render() {
    return (
      <div className="card card-section" >
        <div className="card-body">
          <h2 className="card-title">Individual Holdings</h2>
          {this.props.ticker['USDT_BTC'] && Object.keys(this.props.holdings).length ? (
            this.renderTiles()
          ) : (
              this.renderLoading()
            )}
        </div>
      </div>
    )
  }
}

export default HoldingsTiles