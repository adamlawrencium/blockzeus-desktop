import React, { Component } from 'react';
import Tile from './Tile';

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
        var h = Object.keys(holdings).map(key => [key, holdings[key]]);
        // let hodlings = [] // [BTC, holding_amt, tick_obj]
        // h = h.map(entry => {
        //   for (let j = 0; j < Object.keys(this.props.ticker).length; j++) {
        //     if (entry[0] == Object.keys(this.props.ticker)[j].split('_')[1]) {
        //       // console.log(h[i][0])
        //       console.log(Object.keys(this.props.ticker)[j]);
        //       console.log();
        //       // h[i].push(Object.keys(this.props.ticker)[j]);
        //       let a = entry;
        //       a.push(this.props.ticker[Object.keys(this.props.ticker)[j]]);
        //       return a
        //       // entry.push('hi')
        //       // h[i].push(this.props.ticker[Object.keys(this.props.ticker)[j]]);
        //       // console.log(h[i]);
        //       // return 'blah'
        //     }
        //   }
        // })
        this.setState({ loaded: true })
        console.log(h);
        this.setState({ holdings: h })
      });
  }

  renderLoading() {
    return <h1>Loading...</h1>
  }

  renderTiles() {
    return (
      <div>
        <div className="row">
          {this.state.holdings.filter(h => h[1] > 0).map(holding =>
            <Tile
              key={holding[0]}
              currency={holding[0]}
              amount={holding[1]}
              // price={holding[2].last}
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