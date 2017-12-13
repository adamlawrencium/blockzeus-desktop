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
        return console.log((Date.parse(trade.date)/1000));
      });
      this.setState({ currentTimeSeries: historyTimeSeries });
    }).catch(err => {
      console.log(err)
    });
  }

  renderChart() {
    return (
      <div className="card card-section" >
        <div className="card-body">
          <h2 className="card-title">Portfolio Performance</h2>
          <PortfolioLineChart />
        </div>
      </div>
    )
  }

  renderLoading() {
    return (
      <div>
        <div className="row">
          <div className="col"><h2>Loading...</h2></div>
        </div>
      </div>
    )
  }

  render() {
    if (this.state.currentTimeSeries) {
      return this.renderChart();
    } else {
      return this.renderLoading();
    }
  }
}

export default PerformanceCard

