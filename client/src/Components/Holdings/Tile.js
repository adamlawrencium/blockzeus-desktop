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
            <div className="float-left">
              Price:
              <span style={{ float: 'right' }}>{`$${this.props.price}`}</span>
            </div>

            <p>
              {/* Price (USD): <span> </span> */}
              <br />
              Change: {this.props.priceChange}%
              <br />
              Value: ${this.props.value}
            </p>
            {/* <p>Value (USD): {this.props.value}</p> */}
            <a href="#" className="btn btn-outline-primary btn-sm btn-block">Trade</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Tile;
