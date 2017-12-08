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
        // console.log(h);
        this.setState({ holdings: h })
        this.setState({ loaded: true })
      });
  }

  filterHoldings() {
    console.log(this.state.holdings.filter( holding => { holding[1] > 0 }));
  }

  render() {
    return (
      <div>
        <div className="row">
          {this.state.holdings.map(holding => <Tile currency={holding[0]} />)}
        </div>
        {/* <div><pre>{JSON.stringify(this.state.holdings, null, 2)}</pre></div> */}
      </div>
    )
  }
}

export default HoldingsTiles