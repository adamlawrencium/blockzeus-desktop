import React, { Component } from 'react';
import Highcharts from 'highcharts';
import { theme } from './theme';
import {
  HighchartsChart, Chart, withHighcharts, PieSeries, Title, Tooltip, Legend,
} from 'react-jsx-highcharts';

Highcharts.theme = theme;
Highcharts.setOptions(Highcharts.theme);


class DonutChart extends Component {
  renderLoading() {
    return <h2>Loading...</h2>;
  }
  renderDonut(balances) {
    const plotOptions = {
      pie: {
        allowPointSelect: true,
        dataLabels: {
          distance: 15,
          enabled: true,
        },
      },
    };

    // 2-decimal rounding of USD values in chart
    const b = [];
    for (const i in balances) {
      b.push([balances[i][0], parseFloat(balances[i][1].toFixed(2))]);
    }

    const titleStyle = {
      fontSize: '1.9em',
    };

    return (
      <HighchartsChart plotOptions={plotOptions}>
        <Chart />
        <Title verticalAlign="middle" style={titleStyle}>{`${this.props.total} USD`}</Title>
        <Tooltip />
        <PieSeries
          id="holdings"
          name="USD Value"
          data={b}
          showInLegend
          innerSize="66%"
        />
      </HighchartsChart>
    );
  }

  render() {
    if (this.props.balances) {
      return this.renderDonut(this.props.balances);
    }
    return this.renderLoading();
  }
}

export default withHighcharts(DonutChart, Highcharts);
