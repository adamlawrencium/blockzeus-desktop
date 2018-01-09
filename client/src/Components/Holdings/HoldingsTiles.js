import React, { Component } from 'react';
import Tile from './Tile';

class HoldingsTiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tileSortBy: 'size',
    };
  }

  handleSortChange(sortBy) {
    this.setState({ tileSortBy: sortBy });
  }

  /**
   * Takes in ticker object from Poniex and turns it into an array
   *
   * @param {object} ticker_
   * @returns [[currency, last, %change], ...]
   * @memberof HoldingsTiles
   */
  flattenTicker(ticker_) {
    const ticker = Object.assign({}, ticker_);
    const flattendTicker = [];
    Object.keys(ticker).forEach((currency) => {
      const x = [
        currency,
        parseFloat(ticker[currency].last),
        parseFloat(ticker[currency].percentChange),
      ];
      flattendTicker.push(x);
    });
    return flattendTicker;
  }

  /**
   * Filter ticker data based on holdings
   *
   * @param {2D Array} holdings
   * @param {Object} ticker
   * @returns
   * @memberof HoldingsTiles
   */
  filterTicker(holdings, ticker) {
    const filteredTicker = {};
    console.log(holdings);
    holdings.forEach((holding) => {
      Object.keys(ticker).forEach((currency) => {
        // Find BTC_X market for each holding
        if (currency.split('_')[1] === holding[0] && currency.split('_')[0] === 'BTC') {
          filteredTicker[currency] = ticker[currency];
        }
      });
    });
    console.log(filteredTicker);
    return filteredTicker;
  }


  // function modifies and holdings and adds on an additional 24change
  /*
  creates an array with:
  [currency, amount, usdPrice, usdValue, usdPriceChange]
  */
  createFullTileData(holdings_, ticker_) {
    // create copies of objects
    const ticker = Object.assign({}, ticker_);
    const holdings = Object.assign({}, holdings_);
    console.log(ticker);
    console.log(holdings);
    const flattendTicker = this.flattenTicker(ticker); // convert obj to array

    // Filter ticker based on holdings
    let filteredTicker = this.filterTicker(holdings, ticker);
    console.log(filteredTicker);

    // Create [["pair", price, % change], ...] based on holdings
    filteredTicker = flattendTicker.filter((tick) => {
      for (let holding = 0; holding < Object.keys(holdings).length; holding++) {
        if (holdings[holding][0] === tick[0].split('_')[1] && tick[0].split('_')[0] === 'BTC') {
          return true;
        }
      }
      return false;
    });
    console.log(filteredTicker);

    // Normalize all data to USD base.
    const btcUsdRate = parseFloat(ticker.USDT_BTC.last);
    const btcUsdRateChange = parseFloat(ticker.USDT_BTC.percentChange);
    const rateAdjustedTiles = [];
    Object.keys(filteredTicker).forEach((tick) => {
      const rateUsdBase = filteredTicker[tick][1] * btcUsdRate;
      const changeUsdBase = ((1 + filteredTicker[tick][1]) * (1 + btcUsdRateChange)).toFixed(2);
      // const changeUsdBase = filteredTicker[tick][1];
      rateAdjustedTiles.push([filteredTicker[tick][0].split('_')[1], rateUsdBase.toFixed(4), changeUsdBase]);
    });

    // Manually handle usdt_btc and usdt case
    Object.keys(holdings).forEach((i) => {
      if (holdings[i][0] === 'BTC') {
        rateAdjustedTiles.push(['BTC', parseFloat(ticker.USDT_BTC.last).toFixed(2), parseFloat(ticker.USDT_BTC.percentChange).toFixed(2)]);
      }
      if (holdings[i][0] === 'USDT') {
        rateAdjustedTiles.push(['USDT', '1.00', '1.00']);
      }
    });

    for (let i = 0; i < rateAdjustedTiles.length; i++) {
      Object.keys(holdings).forEach((holding) => {
        if (rateAdjustedTiles[i][0] === holdings[holding][0]) {
          rateAdjustedTiles[i].push((holdings[holding][1]).toFixed(2));
        }
      });
    }

    console.log(rateAdjustedTiles);
    return rateAdjustedTiles;
  }


  renderLoading() {
    return (
      <div className="row">
        <div className="col-12">
          <div style={{ textAlign: 'center' }}>
            <div className="sk-cube-grid">
              <div className="sk-cube sk-cube1" />
              <div className="sk-cube sk-cube2" />
              <div className="sk-cube sk-cube3" />
              <div className="sk-cube sk-cube4" />
              <div className="sk-cube sk-cube5" />
              <div className="sk-cube sk-cube6" />
              <div className="sk-cube sk-cube7" />
              <div className="sk-cube sk-cube8" />
              <div className="sk-cube sk-cube9" />
            </div>
            <h4>Loading your individual holdings...</h4>
          </div>
        </div>
      </div>
    );
  }

  renderTiles(tileSortBy) {
    const holdings = this.createFullTileData(this.props.holdings, this.props.ticker);
    // Sort tiles based on parameter
    if (tileSortBy === 'size') {
      holdings.sort((a, b) => b[3] - a[3]);
    } else if (tileSortBy === 'change') {
      holdings.sort((a, b) => b[2] - a[2]);
    } else if (tileSortBy === 'price') {
      holdings.sort((a, b) => b[1] - a[1]);
    }

    return (
      <div className="row">
        {holdings.map(holding =>
          (<Tile
            key={holding[0]}
            currency={(holding[0])}
            price={holding[1]}
            priceChange={holding[2]}
            value={holding[3]}
          />))}
      </div>
    );
  }

  render() {
    return (
      <div className="card card-section" >
        <div className="card-body">
          <div className="row">
            <div className="col"><h2>Individual Holdings</h2></div>
            <div className="col">
              {/* Sorting */}
              <span className="float-right">
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                  <label className={`btn btn-secondary btn-outline-secondary ${this.state.tileSortBy === 'size' ? 'active' : ''}`} onClick={() => this.handleSortChange('size')}>
                    <input type="radio" name="options" id="option1" autoComplete="off" defaultChecked /> Holding Size
                  </label>
                  <label className={`btn btn-secondary btn-outline-secondary ${this.state.tileSortBy === 'price' ? 'active' : ''}`} onClick={() => this.handleSortChange('price')}>
                    <input type="radio" name="options" id="option2" autoComplete="off" /> Price
                  </label>
                  <label className={`btn btn-secondary btn-outline-secondary ${this.state.tileSortBy === 'change' ? 'active' : ''}`} onClick={() => this.handleSortChange('change')}>
                    <input type="radio" name="options" id="option3" autoComplete="off" /> Change
                  </label>
                </div>
              </span>
            </div>
          </div>

          {this.props.ticker.USDT_BTC && Object.keys(this.props.holdings).length ? (
            this.renderTiles(this.state.tileSortBy)
          ) : (
              this.renderLoading()
            )}
        </div>
      </div>
    );
  }
}

export default HoldingsTiles;
