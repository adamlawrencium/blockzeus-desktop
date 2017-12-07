import React, { Component } from 'react';

class Tile extends Component {
  render() {
    return (
    <div className="card" style={{ width: '20rem' }}>
      <img className="card-img-top" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
      <div className="card-body">
        <h4 className="card-title">Card title</h4>
        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" className="btn btn-primary">Go somewhere</a>
      </div>
    </div>
    )
  }
}

export default Tile