import React, { Component } from 'react';
import Highcharts from 'highcharts';
import {
  HighchartsChart, Chart, withHighcharts, PieSeries, Legend, Title
} from 'react-jsx-highcharts';


class DonutChart extends Component {

  state = {
    balances: [],
    loaded: false,
    totalValue: 0
  }

  componentDidMount() {
    fetch('/poloniexData/completeBalances')
      .then(res => res.json())
      .then(balances => {
        balances = this.poloObjectToArray(balances).filter(b => b[1] > 0).sort((i,j) => j[1] - i[1])
        this.setState({ balances })
        this.setState({ loaded: true })
      })
  }

  poloObjectToArray(obj) {
    let a = [];
    let total = 0;
    for (let key in obj) {
      a.push([key, parseFloat(obj[key]['btcValue'])])
      total += parseFloat(obj[key]['btcValue'])
    }
    total = parseFloat(total.toFixed(8))
    this.setState({ totalValue: total });
    return a;
  }

  renderLoading() {
    return <h2>Loading...</h2>
  }

  renderDonut() {
    const plotOptions = {
      pie: {
        allowPointSelect: true,
        dataLabels: {
          distance: 15,
          enabled: true
        }
      }
    };
    return (
      <HighchartsChart plotOptions={plotOptions}>
        <Chart />
        <Title verticalAlign="middle">{`${this.state.totalValue.toString()} BTC`}</Title>
        {/* <Legend /> */}
        <PieSeries id="holdings" name="holdings" data={this.state.balances} showInLegend={true} innerSize="0%" />
      </HighchartsChart>
    )
  }

  render() {
    if (this.state.loaded) {
      return this.renderDonut();
    } else {
      return this.renderLoading();
    }
  }
}

export default withHighcharts(DonutChart, Highcharts)