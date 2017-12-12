import React, { Component } from 'react';
import PortfolioLineChart from './PortfolioLineChart';

class PerformanceCard extends Component {
  render() {
    return (
      <div className="card" >
        <div className="card-body">
          <h2 className="card-title">Portfolio Performance</h2>
          <PortfolioLineChart />
        </div>
      </div>
    )
  }
}

export default PerformanceCard

