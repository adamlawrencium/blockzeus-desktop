import React, { Component } from 'react';
import Highcharts from 'highcharts';
import {
  HighchartsChart, Chart, withHighcharts, PieSeries, Title, Tooltip
} from 'react-jsx-highcharts';


class DonutChart extends Component {

  renderLoading() {
    return <h2>Loading...</h2>
  }
  renderDonut(balances) {
    const plotOptions = {
      pie: {
        allowPointSelect: true,
        dataLabels: {
          distance: -30,
          enabled: true
        }
      }
    };

    return (
      <HighchartsChart plotOptions={plotOptions}>
        <Chart />
        <Title verticalAlign="middle">{`${this.props.total} USD`}</Title>
        <Tooltip />
        <PieSeries
          id="holdings"
          name="USD Value"
          data={balances}
          showInLegend={true}
          innerSize="66%"
        />
      </HighchartsChart>
    )
  }

  render() {
    if (this.props.balances) {
      return this.renderDonut(this.props.balances);
    } else {
      return this.renderLoading();
    }
  }
}

export default withHighcharts(DonutChart, Highcharts)