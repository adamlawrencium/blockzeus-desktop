import React, { Component } from 'react';
import Tile from './Tile';



class HoldingsTiles extends Component {
  constructor(props) {
    super(props);
    fetch('/poloniexData/balances')
      .then(res => res.json())
      .catch(e => console.log(e))
      .then(holdings => {
        var h = Object.keys(holdings).map(key => [key, holdings[key]]);
        this.setState({ loaded: true })
        this.setState({ holdings: h })
      });
    // console.log(props.ticker)
  }


  state = {
    holdings: [],
    loaded: false
  }

  componentDidMount() {
    // this.normalizeTickerToUSDT(this.props.ticker);
  }


  normalizeTickerToUSDT(ticker) {
    let btc_usd_rate = parseFloat(ticker['USDT_BTC']['last']);
    let btc_usd_rate_change = parseFloat(ticker['USDT_BTC']['percentageChange']);
    let normalizedTicker = []
    for (let tick in ticker) {
      if (tick.split("_")[0] === 'BTC') {
        normalizedTicker.push([
          tick.split("_")[1],
          parseFloat(ticker[tick]['last']) * btc_usd_rate,
          (1+parseFloat(ticker[tick]['percentageChange']))*(1+btc_usd_rate_change)
        ])
      }
    }
    // console.log(normalizedTicker);
  }

  renderLoading() {
    return (
      <div>
        <div className="row">
          <div className="col"><h2>Loading...</h2></div>
        </div>
      </div>
    )
  }

  renderTiles() {
    // console.log(this.props)
    this.normalizeTickerToUSDT(this.props.ticker)
    return (
      <div>
        <div className="row">
          {/* <div className="col"><h1>Individual Holdings</h1></div> */}
        </div>
        <div className="row">
          {this.state.holdings.filter(h => h[1] > 0).map(holding =>
            <Tile
              key={holding[0]}
              currency={holding[0]}
              amount={holding[1]}
            // price={holding[2].last}
            />)}
        </div>
      </div>
    )
  }

  render() {
    if (this.state.loaded && this.props.ticker['USDT_BTC']) {
      return this.renderTiles();
    } else {
      return this.renderLoading();
    }
  }
}

export default HoldingsTiles