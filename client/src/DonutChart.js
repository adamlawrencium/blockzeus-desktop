import React, { Component } from 'react';
import Highcharts from 'highcharts';
import {
  HighchartsChart, Chart, withHighcharts, PieSeries, Legend
} from 'react-jsx-highcharts';


class DonutChart extends Component {

  updatePortfolio() {
    return [['ZEC', 0.06138262],
    ['DASH', 0.00000362],
    ['BTCD', 0.07855733],
    ['DASH', 0.00000362],
    ['MAID', .1354355480],
    ['REP', 0.00003815],
    ['LSK', 0.20641178],
    ['ZEC', 0.06138262],
    ['XRP', .1730111802],
    ['USDT', .18860279],
    ['BTC', 0.00099013],
    ['STEEM', 0.00039982]]
  }

  render() {
    return (
      <HighchartsChart>
        <Chart />
        <Legend />
        <PieSeries id="holdings" name="holdings" data={this.updatePortfolio()} showInLegend={true} innerSize="60%" />
      </HighchartsChart>
    )
  }
}

export default withHighcharts(DonutChart, Highcharts)