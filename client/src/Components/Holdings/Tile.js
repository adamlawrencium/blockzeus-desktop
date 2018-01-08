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
      <div className="col-lg-3 col-md-4 col-xs-6">
        <div className={`card card-section price-${color}`}>
          <h4 className="card-header">{this.props.currency}</h4>
          <div className="card-body">

            <div className="col">
              <div className="row">
                <ul className="fa-ul">
                  <li><span className="fa-li bz-metric"><i className="fas fa-chart-pie" /></span>${this.props.value}</li>
                  <li><span className="fa-li bz-metric"><i className="fas fa-chart-bar" /></span>${this.props.price}</li>
                  <li><span className="fa-li bz-metric"><i className="fas fa-arrows-alt-v" /></span>{this.props.priceChange}%</li>
                </ul>
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
