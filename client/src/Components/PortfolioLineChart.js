import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
import {
  HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis,
  AreaSplineSeries, RangeSelector, Tooltip
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
      data1: createRandomData(now, 1e8),
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

          <YAxis id="price">
            <YAxis.Title>Price</YAxis.Title>
            <AreaSplineSeries id="profit" name="Profit" data={data1} />
          </YAxis>
          {/* 
          <YAxis id="social" opposite>
            <YAxis.Title>Social Buzz</YAxis.Title>
            <SplineSeries id="twitter" name="Twitter mentions" data={data2} />
          </YAxis> */}

          {/* <Navigator>
            <Navigator.Series seriesId="profit" />
            <Navigator.Series seriesId="twitter" />
          </Navigator> */}
        </HighchartsStockChart>

        {/* <ExampleCode name="Highstocks">{code}</ExampleCode> */}

      </div>
    );
  }
}

export default withHighcharts(PortfolioLineChart, Highcharts);