import React, { Component } from 'react';
import PortfolioLineChart from './PortfolioLineChart';
import { fetchPortfolioPerformance, fetchFullDemoPortfolioPerformance } from '../../API/poloniex';


class DemoPerformanceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolioPerformance: [],
      fullPerformance: {},
      loaded: false,
    };
  }

  componentWillMount() {
    fetchFullDemoPortfolioPerformance().then((fullPerformance) => {
      this.setState({ fullPerformance });
      this.setState({ loaded: true });
      // console.log(fullPerformance);
    }).catch(err => console.log(err));
  }

  renderChart() {
    return (
      <div className="card card-section h-100" >
        <div className="card-body">
          {/* <h2 className="card-title">Portfolio Value</h2> */}
          <div className="row">
            <div className="col-sm-6">
              <h2 className="card-title">Portfolio Value</h2>
            </div>
            <div className="col-sm-6">
              {/* <button className="btn btn-xs btn-outline-success float-left">
                Log
              </button> */}
            </div>
          </div>
          <PortfolioLineChart loaded={this.state.loaded} data={this.state.fullPerformance} />
        </div>
      </div>
    );
  }

  renderLoading() {
    return (
      <div className="card card-section h-100" >
        <div className="card-body">

          <div className="row">
            <div className="col-sm-6">
              <h2 className="card-title">Portfolio Value</h2>
            </div>
            <div className="row">
              <small>hello</small>
            </div>
          </div>

          <div className="col"><h2>Loading...</h2></div>
        </div>
      </div>
    );
  }

  render() {
    if (1) {
      return this.renderChart();
    }
    return this.renderLoading();
  }
}

export default DemoPerformanceCard;

