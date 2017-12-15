import React, { Component } from 'react';
import PortfolioLineChart from './PortfolioLineChart';
import { fetchPortfolioPerformance } from '../exchanges/poloniex';


class PerformanceCard extends Component {

  state = {
    portfolioPerformance: []
  }

  componentWillMount() {
    fetchPortfolioPerformance('USDT_BTC').then(portfolioPerformance => {
      portfolioPerformance.map((p) => p[0] *= 1000);
      portfolioPerformance.shift();
      console.log(portfolioPerformance);
      this.setState({ portfolioPerformance })
    }).catch(err => console.log(err));
  }

  renderChart() {
    return (
      <div className="card card-section" >
        <div className="card-body">
          <h2 className="card-title">Portfolio Performance (BTC)</h2>
          <PortfolioLineChart d={this.state.portfolioPerformance} />
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
    if (this.state.portfolioPerformance.length !== 0) {
      return this.renderChart();
    } else {
      return this.renderLoading();
    }
  }
}

export default PerformanceCard

