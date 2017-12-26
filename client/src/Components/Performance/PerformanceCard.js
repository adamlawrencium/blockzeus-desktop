import React, { Component } from 'react';
import PortfolioLineChart from './PortfolioLineChart';
import { fetchPortfolioPerformance, fetchFullPortfolioPerformance } from '../../exchanges/poloniex';


class PerformanceCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      portfolioPerformance: [],
      fullPerformance: {},
      loaded: false
    }
  }

  componentWillMount() {
    fetchFullPortfolioPerformance().then(fullPerformance => {
      this.setState({ fullPerformance });
      this.setState({loaded: true});
      // console.log(fullPerformance);
    }).catch(err => console.log(err));
  }

  renderChart() {
    return (
      <div className="card card-section" >
        <div className="card-body">
          <h2 className="card-title">Portfolio Value</h2>
          <PortfolioLineChart loaded={this.state.loaded} data={this.state.fullPerformance} />
        </div>
      </div>
    )
  }

  renderLoading() {
    return (
      <div className="card card-section" >
        <div className="card-body">
          <h2 className="card-title">Portfolio Value</h2>
          <div className="col"><h2>Loading...</h2></div>
        </div>
      </div>
    )
  }

  render() {
    if (1) {
      return this.renderChart();
    } else {
      return this.renderLoading();
    }
  }
}

export default PerformanceCard

