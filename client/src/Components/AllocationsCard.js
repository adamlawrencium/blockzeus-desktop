import React, { Component } from 'react';
import DonutChart from './DonutChart';

class AllocationsCard extends Component {
  totalBtcValue() {
    // weird behavior here with the undef conditional...
    if (this.props.ticker['USDT_BTC'] == undefined) { return "Loading..." }
    let total = 0.0;
    for (let i = 0; i < this.props.balances.length; i++) {
      total += this.props.balances[i][1];
    }
    return (total * this.props.ticker['USDT_BTC']['last']).toFixed(2);
  }

  render() {
    return (
      <div className="card card-section" >
        <div className="card-body">
          <h2 className="card-title">Digital Asset Allocations</h2>
          <DonutChart balances={this.props.balances} total={this.totalBtcValue()} />
          {/* <h5>Total Value: ${this.totalBtcValue()}</h5> */}
        </div>
      </div>
    )
  }
}

export default AllocationsCard