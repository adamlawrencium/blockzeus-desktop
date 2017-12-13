import React, { Component } from 'react';
import PortfolioLineChart from './PortfolioLineChart';
import { fetchTradeHistory } from '../exchanges/poloniex';


class PerformanceCard extends Component {

  state = {
    currentTimeSeries: []
  }

  componentWillMount() {
    fetchTradeHistory('USDT_BTC').then(h => {
      let historyTimeSeries = h.map(trade => {
        console.log((Date.parse(trade.date)/1000));
      })
    });
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="card card-section" >
        <div className="card-body">
          <h2 className="card-title">Portfolio Performance</h2>
          <PortfolioLineChart />
        </div>
      </div>
    )
  }
}

export default PerformanceCard

