import React, { Component } from 'react';

class Tile extends Component {
  render() {
    return (
      <div className="col">
        <div className="card">
          <div className="card-body">
            {/* <h4 className="card-title">{this.props.currency}</h4> */}
            <h2>{this.props.currency}</h2>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" className="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
    )
  }
}

export default Tile