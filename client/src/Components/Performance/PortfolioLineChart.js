import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
// import HighchartsBoost from 'highcharts/modules/boost';
import {
  HighchartsStockChart, Chart, withHighcharts,
  XAxis, YAxis, Legend,
  Loading, Scrollbar, AreaSeries,
  AreaSplineSeries,
  LineSeries, RangeSelector, Tooltip,
  Navigator, SplineSeries,
} from 'react-jsx-highstock';
import { theme } from './lineChartTheme';

// HighchartsBoost(Highcharts);
Highcharts.theme = theme;
Highcharts.setOptions(Highcharts.theme);

class PortfolioLineChart extends Component {
  formatForChart() {
    if (this.props.data) {
      const { data } = this.props;
      console.log(data);
      const highchartsSeries = [];
      // remove price and quantity data, leave ts and value
      Object.keys(data).forEach((series) => {
        highchartsSeries.push([series, data[series].map(x => [x[0], x[3]])]);
      });
      // for (const series in data) {
      //   highchartsSeries.push([series, data[series].map(x => [x[0], x[3]])]);
      // }
      return highchartsSeries;
    }

    return [
      ['BTC', [[1466049600000, 0], [1512230400000, 2]]],
    ];
  }

  render() {
    const plotOptions = {
      area: {
        // dataGrouping: {
        //   groupPixelWidth: 5,
        // },
        stacking: 'normal',
        // lineColor: '#666666',
        // lineWidth: 1,
      },
    };

    const buttonTheme = { // styles for the buttons
      fill: 'none',
      stroke: 'none',
      'stroke-width': 0,
      style: {
        color: '#483453',
        fontWeight: 'bold',
      },
      states: {
        hover: {
        },
        select: {
          fill: '#483453',
          style: {
            color: 'white',
          },
        },
      },
    };


    return (
      <div className="app" >
        <HighchartsStockChart plotOptions={plotOptions}>
          <Chart zoomType="x" />

          <Loading isLoading={!this.props.loaded}>Fetching portfolio data...</Loading>

          <RangeSelector buttonTheme={buttonTheme}>
            <RangeSelector.Button count={1} type="day">1D</RangeSelector.Button>
            <RangeSelector.Button count={7} type="day">1W</RangeSelector.Button>
            <RangeSelector.Button count={1} type="month">1M</RangeSelector.Button>
            <RangeSelector.Button count={3} type="month">3M</RangeSelector.Button>
            <RangeSelector.Button count={1} type="year">1Y</RangeSelector.Button>
            <RangeSelector.Button type="all">All</RangeSelector.Button>
            <RangeSelector.Input boxBorderColor="#483453" />
          </RangeSelector>

          <Tooltip />

          <Legend />

          <XAxis />

          <YAxis id="value">
            <YAxis.Title>Portfolio Value (USD)</YAxis.Title>

            {!this.props.loaded ? (
              <AreaSeries color="#ffffff" key="x" id="x" name="x" data={[[0, 1337]]} />
            ) : (
                this.formatForChart().map(series => (<AreaSeries
                  key={series[0]}
                  id={series[0]}
                  name={series[0]}
                  data={series[1]}
                  boostThreashold={300}
                />))
              )
            }

          </YAxis>

          <Navigator>
            {this.props.loaded && (
              Object.keys(this.props.data).map((series) => {
                console.log(series);
                return <Navigator.Series key={series} seriesId={series} />;
              })
            )}
          </Navigator>

        </HighchartsStockChart>
      </div>
    );
  }
}

export default withHighcharts(PortfolioLineChart, Highcharts);
