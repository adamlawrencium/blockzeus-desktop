import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
import {
  HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Legend, Loading,
  AreaSeries, RangeSelector, Tooltip, Navigator
} from 'react-jsx-highstock';

class PortfolioLineChart extends Component {

  formatForChart() {
    console.log(this.props);
    let data = this.props.data;
    console.log(data);
    let highchartsSeries = [];
    for (let series in data) {
      // console.log(series);
      // console.log(data[series]);
      // console.log(data.series);
      let s = {}
      s[series] = data[series].map(x => [x[0], x[2]]);
      highchartsSeries.push(s);
      // highchartsSeries.push({
      //   series: data[series].map(x => [x[0], x[2]])
      // });
    }
    console.log(highchartsSeries);
    return highchartsSeries
  }

  render() {
    return (
      <div className="app">
        <HighchartsStockChart>
          <Chart zoomType="x" />

          <Loading isLoading={!this.props.loaded}>Fetching data...</Loading>

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

            {this.formatForChart().map(series => {
              console.log(series);
              return <AreaSeries key={series[0]} id={series[0]} name={series[0]} data={series[1]} />
            })}

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
