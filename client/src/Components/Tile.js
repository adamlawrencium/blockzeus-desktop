import React, { Component } from 'react';

class Tile extends Component {
  render() {
    return (
      <div className="col-md-3 col-sm-4 col-xs-6">
        <div className="card">
          <div className="card-body">
            <h2>{this.props.currency}</h2>
            <p>USD Amount: {this.props.amount}</p>
            <p>24hr Change: {this.props.priceChange}%</p>
            <a href="google.com" className="btn btn-primary">Buy/Sell</a>
          </div>
        </div>
      </div>
    )
  }
}

export default Tile