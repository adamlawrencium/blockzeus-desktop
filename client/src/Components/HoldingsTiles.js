import React, { Component } from 'react';
import Tile from './Tile';

class HoldingsTiles extends Component {
  // constructor(props) {
  //   super(props);
  //   fetch('/poloniexData/balances')
  //     .then(res => res.json())
  //     .catch(e => console.log(e))
  //     .then(holdings => {
  //       var h = Object.keys(holdings).map(key => [key, holdings[key]]);
  //       this.setState({ loaded: true })
  //       this.setState({ holdings: h })
  //     });
  //   // console.log(props.ticker)
  // }

  flattenTicker(ticker) {
    // console.log(ticker);
    let tickcopy = Object.assign({}, ticker);
    let flattendTicker = []
    for (let tick in tickcopy) {
      let x = [tick, parseFloat(tickcopy[tick]['last']), parseFloat(tickcopy[tick]['percentChange'])];
      flattendTicker.push(x);
    }
    // console.log(flattendTicker);
    return flattendTicker;
  }


  // function modifies and holdings and adds on an additional 24change
  /*
  creates an array with:
  [currency, amount, usdPrice, usdValue, usdPriceChange]
  */
  createFullTileData(holdings_, ticker_) {
    const tickcopy = Object.assign({}, ticker_);
    const holdcopy = Object.assign({}, holdings_); 
    const flattendTicker = this.flattenTicker(tickcopy);
    let tileData = flattendTicker.filter(tick => { // only keep ticks that are in holdings
      for (let holding in holdcopy) {
        // assume a btc market exists for every non-btc market of the same trade currency
        if (holdcopy[holding][0] === tick[0].split('_')[1] && tick[0].split('_')[0] === 'BTC') {
          // console.log(holdings_[holding], tick[0]);
          return true;
        }
      }
      return false
    });
    
    let btc_usd_rate = parseFloat(tickcopy['USDT_BTC']['last']);
    let btc_usd_rate_change = parseFloat(tickcopy['USDT_BTC']['percentChange']);
    
    let rateAdjustedTiles = []
    for (let holding in tileData) {
      console.log(tileData[holding][0]);
      console.log(tileData[holding][2]);
      console.log(btc_usd_rate_change);
      let rate_to_usd_base = tileData[holding][1] * btc_usd_rate;
      let chng_to_usd_base = (1 + tileData[holding][1]) * (1 + btc_usd_rate_change);
      console.log(chng_to_usd_base);
      console.log('');
      rateAdjustedTiles.push([tileData[holding][0], rate_to_usd_base, chng_to_usd_base]);
    }
    console.log(rateAdjustedTiles);
    return
    // tileData = tileData.map(t => {
    //   console.log(t);
    //   let to_usd_base = 
    //   t[1] = (t[1]) * btc_usd_rate;
    //   t[2] = (1 + (t[1])) * (1 + btc_usd_rate_change);
    // });
    console.log(tileData);
    // Manually handle usdt_btc case
    for (let i in holdcopy) {
      if (holdcopy[i][0] === 'BTC') {
        tileData.push(["BTC", tickcopy["USDT_BTC"]["last"], tickcopy["USDT_BTC"]["percentChange"]]);
      }
    }
    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    // console.log(tileData);
    return 1;


    // let holdings = []
    // for (let tick in ticker) {
    //   if (tick.split("_")[0] === 'BTC') {
    //     holdings.push([
    //       tick.split("_")[1],
    //       parseFloat(ticker[tick]['last']) * btc_usd_rate,
    //       (1 + parseFloat(ticker[tick]['percentageChange'])) * (1 + btc_usd_rate_change)
    //     ]);
    //   }

    // }

    // let normalizedTicker = []
    // for (let tick in ticker) {
    //   if (tick.split("_")[0] === 'BTC') {
    //     normalizedTicker.push([
    //       tick.split("_")[1],
    //       parseFloat(ticker[tick]['last']) * btc_usd_rate,
    //       (1 + parseFloat(ticker[tick]['percentageChange'])) * (1 + btc_usd_rate_change)
    //     ]);
    //   }
    // }
    // console.log(normalizedTicker);
  }

  renderLoading() {
    return (
      <h2>Loading...</h2>
    )
  }

  renderTiles() {
    let holdings = this.createFullTileData(this.props.holdings, this.props.ticker);
    return (<h>hi</h>);
    holdings.map(holding => holding.push())
    return (
      <div className="row">
        {holdings.map(holding =>
          <Tile
            key={holding[0]}
            currency={(holding[0])}
            amount={holding[1].toFixed(2)}
            usdPrice={holding[2]}
            usdValue={holding[3]}
            usdPriceChange={holding[4]}
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