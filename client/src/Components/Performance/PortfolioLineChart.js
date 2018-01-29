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
import { theme } from './theme';

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
      (<AreaSplineSeries
        key={series[0]}
        id={series[0]}
        name={series[0]}
        data={series[1]}
        boostThreashold={300}
      />));

    return lines;
  }

  renderNavigator() {
    if (!this.props.loaded) return;

    // Test Data =================
    const d = [
      [1433282400000, 46.85],
      [1433368800000, 46.36],
      [1433455200000, 46.14],
      [1433714400000, 45.73],
      [1433800800000, 45.65],
      [1433887200000, 46.61],
      [1433973600000, 46.44],
      [1434060000000, 45.97],
      [1434319200000, 45.48],
      [1434405600000, 45.83],
      [1434492000000, 45.97],
      [1434578400000, 46.72],
      [1434664800000, 46.10],
      [1434924000000, 46.23],
      [1435010400000, 45.91],
      [1435096800000, 45.63],
      [1435183200000, 45.65],
      [1435269600000, 45.26],
      [1435528800000, 44.37],
      [1435615200000, 44.15],
      [1435701600000, 44.45],
      [1435788000000, 44.40],
      [1436133600000, 44.39],
      [1436220000000, 44.30],
      [1436306400000, 44.24],
      [1436392800000, 44.52],
      [1436479200000, 44.61],
      [1436738400000, 45.54],
      [1436824800000, 45.62],
      [1436911200000, 45.76],
      [1436997600000, 46.66],
      [1437084000000, 46.62],
      [1437343200000, 46.92],
      [1437429600000, 47.28],
      [1437516000000, 45.54],
      [1437602400000, 46.11],
      [1437688800000, 45.94],
      [1437948000000, 45.35],
      [1438034400000, 45.34],
      [1438120800000, 46.29],
      [1438207200000, 46.88],
      [1438293600000, 46.70],
      [1438552800000, 46.81],
      [1438639200000, 47.54],
      [1438725600000, 47.58],
      [1438812000000, 46.62],
      [1438898400000, 46.74],
      [1439157600000, 47.33],
      [1439244000000, 46.41],
      [1439330400000, 46.74],
      [1439416800000, 46.73],
      [1439503200000, 47.00],
      [1439762400000, 47.32],
      [1439848800000, 47.27],
      [1439935200000, 46.61],
      [1440021600000, 45.66],
    ];
    // Performant
    /*
    const series = {
      data: d,
    };
    */
    // Test Data =================

    const timestep = 14400000;
    let totalValueTimeSeries = [];
    let minTimeValue = Number.MAX_VALUE;
    let maxTimeValue = 0;
    let valueMap = new Map();


    for (var key in this.props.data) {
        if (this.props.data.hasOwnProperty(key)) {

          // Transforming data of type {'currency':[[Time,~,~,AmtOwnedUSD], ...], ...} (this.props.data)
          //  to data of type MAP{'Time' : [currencyA_AmtOwnedUSD, currencyB_AmtOwnedUSD, ...]}
          for (let i = 0; i < this.props.data[key].length; i++){
            if (valueMap.has(this.props.data[key][i][0])){
              valueMap.get(this.props.data[key][i][0]).push(this.props.data[key][i][3])
            }
            else {
              valueMap.set(this.props.data[key][i][0], [this.props.data[key][i][3]])
            }
          }

          // Finding the minimimum start date and maximum end date for historical data
          if (this.props.data[key][0][0] < minTimeValue){
            minTimeValue = this.props.data[key][0][0];
            maxTimeValue = this.props.data[key][(this.props.data[key].length) - 1][0];
          }
        }
    }

    // Transforming ValueMap of data type MAP{'Time' : [currencyA_AmtOwnedUSD, currencyB_AmtOwnedUSD, ...]}
    //  to data type of [[time, totalUSDAmt], [time, totalUSDAmt], ...]
    while (minTimeValue <= maxTimeValue){
      let value = 0.0
      for (let i = 0; i< valueMap.get(minTimeValue).length;i++){
        value += valueMap.get(minTimeValue)[i]
      }
      totalValueTimeSeries.push([minTimeValue, value])

      minTimeValue += timestep;
    }

    // TEMPORARY OTHER SOLUTIONS (ME NO DELETE CAUSE ME SAD)

    /* INCOMPLETE indexOf SOLUTION

    const timestep = 14400000;
    let totalValueTimeSeries = [];
    let minTimeValue = Number.MAX_VALUE;
    let maxTimeValue = 0;
    let minKey;
    let startingTimeValue = [];

    console.log(this.props.data);

    for (var key in this.props.data) {
        if (this.props.data.hasOwnProperty(key)) {
          startingTimeValue.push([key, this.props.data[key][0][0]]);
          if (this.props.data[key][0][0] < minTimeValue){
            minTimeValue = this.props.data[key][0][0];
            maxTimeValue = this.props.data[key][(this.props.data[key].length) - 1][0];
            minKey = key;
          }
        }
    }

    while (minTimeValue <= maxTimeValue){
      let value = 0.0
      for (var key in this.props.data) {
          if (this.props.data.hasOwnProperty(key)) {
            this.props.data[key]
          }
      }


      minTimeValue += timestep;
    }
    */

    /* INCOMPLETE ZERO FILL SOLUTION
    const maxLength = this.props.data[minKey].length
    let zeroedTimeSeries = []

    for (var key in this.props.data) {
        if (this.props.data.hasOwnProperty(key)) {
          let original = this.props.data[key].slice()
          let zeroes = Array(maxLength - original.length).fill
          zeroesTimeSeries.push()
        }
    }

    Array(x).fill(0)
    */

    /* INCOMPLETE FIND START DATE SOLUTION
    function sortfunction(a, b){ //causes an array to be sorted numerically and ascending
      return (a[1] - b[1])
    }
    startingTimeValue.sort(sortfunction)

    for (i = 0; i < startingTimeValue.length ; i++){
      value += this.props.data[startedSeries[i]][][3]
    }

    let startedSeries = []
    console.log(startingTimeValue)

    while (minTimeValue <= maxTimeValue){
      if (startingTimeValue.length > 0 && minTimeValue == startingTimeValue[0][1]){
        startedSeries.push(startingTimeValue[0][0]);
        startingTimeValue.shift();
      }
      let value = 0.0
      for (i = 0; i < startedSeries.length; i++){
        value += this.props.data[startedSeries[i]][][3]
      }


      minTimeValue += timestep;
    }

*/

    const series = {
      data: totalValueTimeSeries,
    };

    return (
      <Navigator series={series} />
    );

    // TODO - this is too performance intensive
    return (
      <Navigator>
        {Object.keys(this.props.data).map(series => <Navigator.Series key={series} seriesId={series} />)}
      </Navigator>
    );
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
        stacking: 'normal',
      },
      areaspline: {
        stacking: 'normal',
      },
    };

    const buttonTheme = { // styles for the buttons
      fill: 'none',
      stroke: 'none',
      'stroke-width': 0,
      style: {
        color: '#482D62',
        fontWeight: 'bold',
      },
      states: {
        hover: {
        },
        select: {
          fill: '#482D62',
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
        backgroundColor: '#482D62',
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
            {/* <RangeSelector.Input boxBorderColor="#483453" /> */}
          </RangeSelector>

          <Tooltip />

          <Legend />

          <XAxis />

          <YAxis id="value" crosshair={ycross} >
            <YAxis.Title>Portfolio Value (USD)</YAxis.Title>
            {this.renderData()}
            {/* {this.renderFlags()} */}
          </YAxis>

          {this.renderNavigator()}

          <Scrollbar />

        </HighchartsStockChart>
      </div>
    );
  }
}

export default withHighcharts(PortfolioLineChart, Highcharts);
