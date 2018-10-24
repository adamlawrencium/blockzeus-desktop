import React, { Component } from 'react';
import DonutChart from './DonutChart';

class AllocationsCard extends Component {
  totalUSDValue(balances) {
    let total = 0.0;
    for (let i = 0; i < balances.length; i++) {
      total += balances[i][1];
    }
    return total.toFixed(2);
  }

  renderLoading() {
    return (
      <div className="text-center py-4">
        <div className="loader" />
        <h4>Loading your portfolio allocations...</h4>
      </div>
    );
  }

  renderChart() {
    let balances_object = JSON.parse(JSON.stringify(this.props.balances)); // deep copy
    let balances = [];
    for (let currency in balances_object) {
      balances.push([currency, parseFloat(balances_object[currency].btcValue)]);
    }
    // change BTC-valued balances to USD value
    for (let i = 0; i < balances.length; i++) {
      if (balances[i][0] !== 'USDT' || balances[i][1] > 0) {
        console.log(parseFloat(this.props.ticker.USDT_BTC.last));
        balances[i][1] *= parseFloat(this.props.ticker.USDT_BTC.last);
      }
    }
    const total = this.totalUSDValue(balances);
    // Filter balances > 0 and sort by largest to smalling balance
    balances = balances.filter(balance => balance[1] > 0).sort((a, b) => b[1] - a[1]);
    return (
      <DonutChart balances={balances} total={total} />
    );
  }

  render() {
    return (
      <div className="card card-body card-section h-100" >
        <h2 className="card-title">Allocations</h2>
        {this.props.ticker.USDT_BTC && Object.keys(this.props.balances).length ? (
          this.renderChart()
        ) : (
            this.renderLoading()
          )}
      </div>
    );
  }
}

export default AllocationsCard;
