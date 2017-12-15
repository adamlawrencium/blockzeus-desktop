import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
import {
  HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis,
  AreaSplineSeries, RangeSelector, Tooltip, Navigator
} from 'react-jsx-highstock';

export const createDataPoint = (time = Date.now(), magnitude = 1000, offset = 0) => {
  return [
    time + offset * magnitude,
    Math.round((Math.random() * 100) * 2) / 2
  ];
};

export const createRandomData = (time, magnitude) => {
  const data = [];

  for (let i = -99; i <= 0; i++) {
    data.push(createDataPoint(time, magnitude, i));
  }
  return data;
};

export const addDataPoint = (data, toAdd) => {
  if (!toAdd) toAdd = createDataPoint();
  const newData = data.slice(0); // Clone
  newData.push(toAdd);
  return newData;
};


class PortfolioLineChart extends Component {

  constructor(props) {
    super(props);

    const now = Date.now();
    this.state = {
      data1: createRandomData(now, 1e8)
    };
  }

  render() {
    const { data1 } = this.state;

    return (
      <div className="app">
        <HighchartsStockChart>
          <Chart zoomType="x" />

          {/* <Legend>
            <Legend.Title>Key</Legend.Title>
          </Legend> */}

          <RangeSelector>
            <RangeSelector.Button count={1} type="day">1d</RangeSelector.Button>
            <RangeSelector.Button count={7} type="day">7d</RangeSelector.Button>
            <RangeSelector.Button count={1} type="month">1m</RangeSelector.Button>
            <RangeSelector.Button type="all">All</RangeSelector.Button>
            <RangeSelector.Input boxBorderColor="#7cb5ec" />
          </RangeSelector>

          <Tooltip />

          <XAxis>
          </XAxis>

          <YAxis id="value">
            <YAxis.Title>Portfolio Value</YAxis.Title>
            <AreaSplineSeries id="value" name="Value" data={this.props.d.map(x => [x[0], x[3]])} />
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

[[1476057600, 618.75470275, 0.0123, 7.610682843825],
[1476144000, 642.96999999, 0.0123, 7.908530999877001],
[1476230400, 636.00050012, 0.0123, 7.822806151476],
[1476316800, 639.37842931, 0.0123, 7.864354680513],
[1476403200, 640, 0.0123, 7.872],
[1476489600, 640.99999999, 0.0123, 7.884299999877],
[1476576000, 644.4626621, 0.0123, 7.92689074383],
[1476662400, 640.60279395, 0.0123, 7.879414365585]]