import React, { Component } from 'react';
import DonutChart from './DonutChart';

class AllocationsCard extends Component {
  render() {
    return (
      <div className="card" >
        <div className="card-body">
          <h2 className="card-title">Digital Asset Allocations</h2>
          <DonutChart balances={this.props.balances}/>
          <h5>Total Value (BTC): 0.01513</h5>
          <h5>Total Value (USD): 198</h5>
        </div>
      </div>
    )
  }
}

export default AllocationsCard