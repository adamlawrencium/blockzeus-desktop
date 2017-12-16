import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
import {
  HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Legend,
  AreaSeries, RangeSelector, Tooltip, Navigator
} from 'react-jsx-highstock';

class PortfolioLineChart extends Component {
  render() {
    return (
      <div className="app">
        <HighchartsStockChart>
          <Chart zoomType="x" />

          <RangeSelector>
            <RangeSelector.Button count={7} type="day">7d</RangeSelector.Button>
            <RangeSelector.Button count={14} type="day">14d</RangeSelector.Button>
            <RangeSelector.Button count={3} type="month">3m</RangeSelector.Button>
            <RangeSelector.Button count={1} type="year">1yr</RangeSelector.Button>
            <RangeSelector.Button type="all">All</RangeSelector.Button>
            <RangeSelector.Input boxBorderColor="#7cb5ec" />
          </RangeSelector>

          <Tooltip />

          <XAxis>
          </XAxis>

          <YAxis id="value">
            <YAxis.Title>Portfolio Value (USD)</YAxis.Title>
            <AreaSeries id="value" name="Value" data={this.props.d.map(x => [x[0], x[3]])} />
          </YAxis>

          <Navigator>
            <Navigator.Series seriesid="value" />
          </Navigator>

        </HighchartsStockChart>
      </div>
    );
  }
}

export default withHighcharts(PortfolioLineChart, Highcharts);
