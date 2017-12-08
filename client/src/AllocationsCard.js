import React, { Component } from 'react';
import DonutChart from './DonutChart';

class AllocationsCard extends Component {
  render() {
    return (
      <div className="card" >
        <div className="card-body">
          <h4 className="card-title">Digital Asset Holdings</h4>
          <DonutChart />
        </div>
      </div>

    )
  }
}

export default AllocationsCard