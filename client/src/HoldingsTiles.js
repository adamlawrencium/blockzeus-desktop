import React, { Component } from 'react';
import Tile from './Tile';
import { TabContent } from 'reactstrap';

class HoldingsTiles extends Component {

  // state = {
  //   holdings: []
  // }

  componentWillMount() {
    fetch('/poloniexData/balances')
      .then(res => res.json())
      .catch(e => console.log(e))
      .then(holdings => {
        const h = Object.keys(holdings).map(key => [key, holdings[key]]);
        // console.log(h);
        this.setState({ holdings: h })
      });
  }

  render() {
    return (
      <div>
        <div className="row">
          {this.state.holdings.map(holding => <p1>{holding[0]}</p1>)}
        </div>
        {/* <div><pre>{JSON.stringify(this.state.holdings, null, 2)}</pre></div> */}
      </div>
    )
  }
}

export default HoldingsTiles