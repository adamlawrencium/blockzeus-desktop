import React, { Component } from 'react';
import DonutChart from './DonutChart';

class AllocationsCard extends Component {
  totalBtcValue() {
    // weird behavior here with the undef conditional...
    if (this.props.ticker['USDT_BTC'] === undefined) { return "Loading..." }
    let total = 0.0;
    for (let i = 0; i < this.props.balances.length; i++) {
      total += this.props.balances[i][1];
    }
    return (total * this.props.ticker['USDT_BTC']['last']).toFixed(2);
  }

  renderLoading() {
    return <h2>Loading...</h2>
  }

  renderCard() {
    let balances = this.props.balances;
    for (let i in balances) {
      if (balances[i][0] !== "USDT") {
        console.log((this.props.ticker['USDT_BTC']));
        balances[i][1] *= parseFloat(this.props.ticker['USDT_BTC'].last);
      }
    }
    return (
      <div className="card card-section" >
        <div className="card-body">
          <h2 className="card-title">Digital Asset Allocations</h2>
          <DonutChart balances={balances} total={this.totalBtcValue()} />
        </div>
      </div>
    )
  }

  render() {
    if (this.props.ticker['USDT_BTC'] && this.props.balances) {
      return this.renderCard();
    } else {
      return this.renderLoading();
    }
  }
}

export default AllocationsCard