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
    console.log(ticker);
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

  flattenHoldings(holdings_) {
    const holdings = Object.assign({}, holdings_);
    const flattendHoldings = [];
    Object.keys(holdings).forEach((currency) => {
      const x = [currency, parseFloat(holdings[currency].available)];
      flattendHoldings.push(x);
    });
    return flattendHoldings;
  }

  /**
   * Filter out currencies that aren't in holdings
   *
   * @param {2D Array} holdings
   * @param {Object} ticker
   * @returns
   * @memberof HoldingsTiles
   */
  filterTicker(holdings, ticker) {
    console.log(holdings);
    const filteredTicker = {};
    holdings.forEach((holding) => {
      Object.keys(ticker).forEach((currency) => {
        // Find BTC_X market for each holding
        if (currency.split('_')[1] === holding[0] && currency.split('_')[0] === 'BTC') {
          filteredTicker[currency] = ticker[currency];
        }
      });
    });
    return filteredTicker;
  }

  /**
   * Takes in all holdings and ticker, and creates a 2D array ready to be rendered
   * by the Tile component.
   *
   * @param {2D Array} holdings_ BTC-based holdings [[BTC, .12], [XRP, 948], ...]
   * @param {Object} ticker_ straight from Poloniex
   * @returns {2D Array}  [[BTC, USDT-value, price, change], ...]
   * @memberof HoldingsTiles
   */
  createFullTileData(holdings_, ticker_) {
    const ticker = JSON.parse(JSON.stringify(ticker_)); // deep copy
    const holdings = JSON.parse(JSON.stringify(holdings_)); // deep copy

    const flattendHoldings = this.flattenHoldings(holdings).filter(x => x[1] > 0); // object to 2d
    const filteredTicker = this.filterTicker(flattendHoldings, ticker); // only keep currencies that exist in portfolio

    // Normalize data to USDT base
    const BTC_USDT_rate = parseFloat(ticker.USDT_BTC.last);
    const BTC_USDT_change = parseFloat(ticker.USDT_BTC.percentChange);

    const tiles = [];
    flattendHoldings.forEach((holding) => {
      const BTC_X = filteredTicker[`BTC_${holding[0]}`]; // assume a BTC_X market exists
      if (holding[0] === 'USDT') { // handle market neutral USDT case
        tiles.push({
          currency: holding[0],
          dollarValue: holding[1],
          price: 1.00,
          priceChange: 0,
        });
      } else if (holding[0] === 'BTC') { // handle BTC case
        tiles.push({
          currency: holding[0],
          dollarValue: BTC_USDT_rate * holding[1],
          price: BTC_USDT_rate,
          priceChange: BTC_USDT_change,
        });
      } else {
        tiles.push({
          currency: holding[0],
          dollarValue: BTC_USDT_rate * holding[1],
          price: BTC_X.last * BTC_USDT_rate,
          priceChange: BTC_USDT_change + parseFloat(BTC_X.percentChange),
        });
      }
    });
    return tiles;
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
      holdings.sort((a, b) => b.dollarValue - a.dollarValue);
    } else if (tileSortBy === 'change') {
      holdings.sort((a, b) => b.priceChange - a.priceChange);
    } else if (tileSortBy === 'price') {
      holdings.sort((a, b) => b.price - a.price);
    }

    return (
      <div className="row">
        {holdings.map(holding =>
          (<Tile
            key={holding.currency}
            currency={holding.currency}
            value={parseFloat(holding.dollarValue.toFixed(2))}
            price={parseFloat(holding.price.toFixed(2))}
            priceChange={parseFloat((100 * holding.priceChange).toFixed(2))}
          />))}
      </div>
    );
  }

  render() {
    return (
      <div className="card card-section" >
        <div className="card-body">
          <div className="row">
            <div className="col">
              <h2 className="card-title">Individual Holdings</h2>
            </div>
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
