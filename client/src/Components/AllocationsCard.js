import React, { Component } from 'react';
import DonutChart from './DonutChart';

class AllocationsCard extends Component {
  render() {
    return (
      <div className="card" >
        <div className="card-body">
          <h4 className="card-title">Digital Asset Holdings</h4>
          <DonutChart />
          <h5>Total Value (BTC): 0.01513</h5>
          <h5>Total Value (USD): 198</h5>
        </div>
      </div>
    )
  }
}

export default AllocationsCard