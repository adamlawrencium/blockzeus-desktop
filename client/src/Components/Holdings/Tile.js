import React, { Component } from 'react';

class Tile extends Component {
  render() {
    let color = '';
    let icon = '';
    if (this.props.priceChange === 0) {
      color = 'grey';
      icon = 'arrows-alt-h';
    } else if (this.props.priceChange < 0) {
      color = 'red';
      icon = 'angle-double-down';
    } else {
      color = 'green';
      icon = 'angle-double-up';
    }

    return (
      <div className="col-lg-3 col-md-4 col-sm-6">
        <div className={`card card-section price-${color}`}>
          <h4 className="card-header">
            <i className={`mr-2 cc ${this.props.currency}`} title="{this.props.currency}" />
            {this.props.currency}
          </h4>
          <div className="card-body">
            <div className="col">
              <div className="row">
                <ul className="fa-ul">
                  <li><span className="fa-li bz-metric"><i className="fas fa-chart-pie" /></span>${this.props.value}</li>
                  <li><span className="fa-li bz-metric"><i className="fas fa-chart-bar" /></span>${this.props.price}</li>
                  <li><span className="fa-li bz-metric"><i className={`fas fa-${icon}`} /></span>{this.props.priceChange}%</li>
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
