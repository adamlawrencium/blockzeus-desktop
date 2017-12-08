import React, { Component } from 'react';

class Tile extends Component {
  render() {
    return (
      <div className="col-3">
        <div className="card">
          <div className="card-body">
            {/* <h4 className="card-title">{this.props.currency}</h4> */}
            <h2>{this.props.currency}</h2>
            <p className="card-text">You have {this.props.amount} of this currency. Congrats!</p>
            <a href="google.com" className="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
    )
  }
}

export default Tile