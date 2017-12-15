import React, { Component } from 'react';

class Tile extends Component {
  render() {
    let color = '';
    if (this.props.priceChange === '1.00') {color = 'grey'}
    else if (this.props.priceChange < '1.0') {color = 'red'}
    else {color = 'green'}

    return (
      <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6">
        <div className={"card card-section " + "price-"+color}>
        <h4 class="card-header">{this.props.currency}</h4>
          <div className="card-body">
            {/* <h2>{this.props.currency}</h2> */}
            <p>
              Price (USD): {this.props.price}
              <br/>
              24hr Change: {this.props.priceChange}%
              <br/>
              Value (USD): {this.props.value}
            </p>
            {/* <p>Value (USD): {this.props.value}</p> */}
            <a href="google.com" className="btn btn-primary">Buy/Sell</a>
          </div>
        </div>
      </div>
    )
  }
}

export default Tile