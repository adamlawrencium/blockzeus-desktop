import React, { Component } from 'react';
import Tile from './Tile';

class HoldingsTiles extends Component {

  state = {
    holdings: []
  }

  componentDidMount() {
    fetch('/poloniexData/balances')
      .then(res => res.json())
      .catch(e => console.log(e))
      .then(holdings => {
        const h = Object.keys(holdings).map(key => [key, holdings[key]]);
        this.setState({ holdings: h })
      });
  }

  render() {
    return (
      <div>
        <div className="row">
          {this.state.holdings.length !== 0 &&
            this.state.holdings.map(holding => {
              <div>
                <p>hi</p>
              </div>

            })
            
            
          }
          <Tile currency="blah" />
          <Tile currency="blah" />
          <Tile currency="blah" />

        </div>
        {/* <div><pre>{JSON.stringify(this.state.holdings, null, 2)}</pre></div> */}
      </div>
    )
  }
}

export default HoldingsTiles