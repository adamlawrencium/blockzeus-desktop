import React, { Component } from 'react';

class Tile extends Component {
  render() {
    let color = '';
    let icon = '';
    let percentColor = '';
    if (this.props.priceChange === 0) {
      color = 'grey';
      icon = 'arrows-alt-h';
      percentColor = 'secondary';
    } else if (this.props.priceChange < 0) {
      color = 'red';
      icon = 'angle-double-down';
      percentColor = 'danger';
    } else {
      color = 'green';
      icon = 'angle-double-up';
      percentColor = 'success';
    }

    return (
      <div className="col-lg-4 col-md-4 col-sm-6">
        <div className={`card  price-${color}`}>
          <h4 className="card-header tile-header d-flex align-items-center">
            <i className={`mr-2 cc ${this.props.currency}`} title="{this.props.currency}" />
            {this.props.currency}
            <small className={`text-${percentColor} text-right w-100`}>
              <i className={`fas fa-${icon} mr-2`} />
              {this.props.priceChange.toFixed(2)}%
            </small>
          </h4>
          <div className="card-body">
            <div className="col">
              <div className="row">
                <div className="col">
                  <ul className="fa-ul">
                    <li className="text-right"><span className="fa-li bz-metric"><i className="fas fa-chart-pie" /></span>${this.props.value.toFixed(2)}</li>
                    <li className="text-right"><span className="fa-li bz-metric"><i className="fas fa-chart-bar" /></span>${this.props.price.toFixed(2)}</li>
                    {/* <li className="text-right"><span className="fa-li bz-metric"><i className={`fas fa-${icon}`} /></span>{this.props.priceChange.toFixed(2)}%</li> */}
                  </ul>
                </div>
              </div>
            </div>

            {/* <p>Value (USD): {this.props.value}</p> */}
            <a href="https://poloniex.com/exchange#usdt_btc" className="btn btn-outline-primary btn-sm btn-block" target="_blank">View Pair on Poloniex</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Tile;
