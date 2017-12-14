import React, { Component } from 'react';
import DonutChart from './DonutChart';

class AllocationsCard extends Component {

  totalUSDValue() {
    let total = 0.0;
    for (let i = 0; i < this.props.balances.length; i++) {
      total += this.props.balances[i][1];
      console.log(total, this.props.balances[i]);
    }
    console.log(this.props.balances)
    return total.toFixed(2)
  }

  renderLoading() {
    return (
      <h2>Loading...</h2>
    )
  }

  renderChart() {
    let balances = this.props.balances;
    for (let i in balances) {
      if (balances[i][0] !== "USDT") {
        balances[i][1] *= parseFloat(this.props.ticker['USDT_BTC'].last);
      }
    }
    return (
      <DonutChart balances={balances} total={this.totalUSDValue()} />
    )
  }

  render() {
    return (
      <div className="card card-section" >
        <div className="card-body">
          <h2 className="card-title">Digital Asset Allocations</h2>
          {this.props.ticker['USDT_BTC'] && Object.keys(this.props.balances).length ? (
            this.renderChart()
          ) : (
              this.renderLoading()
            )}
        </div>
      </div>
    )
  }
}

export default AllocationsCard