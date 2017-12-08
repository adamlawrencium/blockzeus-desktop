import React, { Component } from 'react';
import Tile from './Tile';
import { TabContent } from 'reactstrap';

class HoldingsTiles extends Component {

  state = {
    holdings: [],
    loaded: false
  }

  componentDidMount() {
    fetch('/poloniexData/balances')
      .then(res => res.json())
      .catch(e => console.log(e))
      .then(holdings => {
        const h = Object.keys(holdings).map(key => [key, holdings[key]]);
        this.setState({ holdings: h })
        this.setState({ loaded: true })
      });
  }

  renderLoading() {
    return <h1>Loading...</h1>
  }

  renderTiles() {
    const { holdings } = this.state.holdings;
    return (
      <div>
        <div className="row">
          {this.state.holdings.filter(h => h[1] > 0).map(holding =>
            <Tile
              currency={holding[0]}
              amount={holding[1]}
            />)}
        </div>
      </div>
    )
  }

  render() {
    if (this.state.loaded) {
      return this.renderTiles();
    } else {
      return this.renderLoading();
    }
  }
}

export default HoldingsTiles