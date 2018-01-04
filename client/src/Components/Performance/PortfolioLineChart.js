import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
// import HighchartsBoost from 'highcharts/modules/boost';
import {
  HighchartsStockChart, Chart, withHighcharts,
  XAxis, YAxis, Legend,
  Loading, Scrollbar, AreaSeries,
  AreaSplineSeries,
  LineSeries, RangeSelector, Tooltip,
  Navigator, SplineSeries, FlagSeries,
} from 'react-jsx-highstock';
import { theme } from './lineChartTheme';

// HighchartsBoost(Highcharts);
Highcharts.theme = theme;
Highcharts.setOptions(Highcharts.theme);

class PortfolioLineChart extends Component {
  formatForChart() {
    const { data } = this.props;
    const highchartsSeries = [];
    Object.keys(data).forEach((series) => {
      highchartsSeries.push([series, data[series].map((x) => {
        if (x[3] === 0) {
          return [x[0], null];
        }
        return [x[0], x[3]];
      })]);
    });

    return highchartsSeries;
  }

  renderData() {
    if (!this.props.loaded) {
      return <AreaSeries color="#ffffff" key="x" id="x" name="x" data={[[0, 1337]]} />;
    }
    const lines = this.formatForChart().map(series =>
      (<AreaSeries
        key={series[0]}
        id={series[0]}
        name={series[0]}
        data={series[1]}
        boostThreashold={300}
      />));

    return lines;
  }

  renderFlags() {
    console.log(this);
    const flags = (
      <FlagSeries
        id="events"
        onSeries="XRP"
        data={[{
          x: 1514793600000,
          title: 'W',
        }]}
      />);
    return flags;
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

    const ycross = {
      snap: false,
      label: {
        enabled: true,
        format: '${value:.2f}',
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

          <YAxis id="value" crosshair={ycross} >
            <YAxis.Title>Portfolio Value (USD)</YAxis.Title>
            {this.renderData()}
            {/* {this.renderFlags()} */}
          </YAxis>

          <Navigator>
            {this.props.loaded && (
              Object.keys(this.props.data).map(series => <Navigator.Series key={series} seriesId={series} />)
            )}
          </Navigator>

          <Scrollbar />

        </HighchartsStockChart>
      </div>
    );
  }
}

export default withHighcharts(PortfolioLineChart, Highcharts);
