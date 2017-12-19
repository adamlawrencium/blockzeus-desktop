import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
import {
  HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Legend, Loading, Scrollbar,
  LineSeries, RangeSelector, Tooltip, Navigator
} from 'react-jsx-highstock';

class PortfolioLineChart extends Component {

  formatForChart() {
    if (this.props.data) {
      let data = this.props.data;
      let highchartsSeries = [];
      // remove price and quantity data, leave ts and value
      for (let series in data) {
        highchartsSeries.push([series, data[series].map(x => [x[0], parseFloat(x[3].toFixed(2))])]);
      }
      return highchartsSeries
    }
    else {
      return [
        ['BTC', [[1466049600000, 0], [1512230400000, 2]]]
      ]
    }
  }

  render() {
    const plotOptions = {
      area: {
        stacking: 'normal',
        lineColor: '#666666',
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: '#666666'
        }
      }
    }

    const buttonTheme = { // styles for the buttons
      fill: 'none',
      stroke: 'none',
      'stroke-width': 0,
      style: {
        color: '#483453',
        fontWeight: 'bold'
      },
      states: {
        hover: {
        },
        select: {
          fill: '#483453',
          style: {
            color: 'white'
          }
        }
      }
    }


    return (
      <div className="app" >
        <HighchartsStockChart plotOptions={plotOptions}>
          <Chart zoomType="x" />

          <Loading isLoading={!this.props.loaded}>Fetching portfolio data...</Loading>

          <RangeSelector buttonTheme={buttonTheme}>
            <RangeSelector.Button count={1} type="day">1d</RangeSelector.Button>
            <RangeSelector.Button count={14} type="day">14d</RangeSelector.Button>
            <RangeSelector.Button count={3} type="month">3m</RangeSelector.Button>
            <RangeSelector.Button count={1} type="year">1yr</RangeSelector.Button>
            <RangeSelector.Button type="all">All</RangeSelector.Button>
            <RangeSelector.Input boxBorderColor="#483453" />
          </RangeSelector>

          <Tooltip />

          <XAxis>
            {/* <Scrollbar /> */}
          </XAxis>

          <YAxis id="value">
            <YAxis.Title>Portfolio Value (USD)</YAxis.Title>

            {!this.props.loaded ? (
              <LineSeries color="#ffffff" key={'x'} id={'x'} name={'x'} data={[[0, 1337]]} />
            ) : (
                this.formatForChart().map(series => {
                  console.log(series);
                  return <LineSeries key={series[0]} id={series[0]} name={series[0]} data={series[1]} />
                })
              )
            }

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
