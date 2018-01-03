import React, { Component } from 'react';

class Tile extends Component {
  render() {
    let color = '';
    if (this.props.priceChange === '1.00') {
      color = 'grey';
    } else if (this.props.priceChange < '1.0') {
      color = 'red';
    } else {
      color = 'green';
    }

    return (
      <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6">
        <div className={`card card-section price-${color}`}>
          <h4 className="card-header">{this.props.currency}</h4>
          <div className="card-body">

            <div className="col">
              <div className="row">
                <p><i className="fas fa-fw fa-chart-pie" />${this.props.value}</p>
              </div>
              <div className="row">
                <p><i className="fas fa-chart-line" />{this.props.priceChange}%</p>
              </div>
              <div className="row">
                <p> <i className="far fa-chart-bar" />${this.props.price}</p>
              </div>
            </div>

            {/* <p>Value (USD): {this.props.value}</p> */}
            <a href="https://poloniex.com/exchange#usdt_btc" className="btn btn-outline-primary btn-sm btn-block" target="_blank">Trade</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Tile;
