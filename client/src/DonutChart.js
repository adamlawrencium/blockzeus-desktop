import React, { Component } from 'react';
const ReactHighcharts = require('react-highcharts');

class DonutChart extends Component {

  // constructor(props) {
  //   super(props)
  // }

  state = {
    blah: 'hi',

    config: {
      chart: {
        renderTo: 'container',
        type: 'pie'
      },
      title: {
        text: ''
      },
      yAxis: {
        title: {
          text: 'Total percent market share'
        }
      },
      plotOptions: {
        pie: {
          shadow: false
        }
      },
      tooltip: {
        formatter: function () {
          return parseInt(this.point.percentage) + '%' + `<br>${this.point.y} ${this.point.name}`;
        }
      },
      series: [{
        name: 'Browsers',
        data: this.updatePortfolio(),
        size: '90%',
        innerSize: '60%',
        showInLegend: true,
        dataLabels: {
          enabled: true
        }
      }]
    }
  }

  updatePortfolio() {
    // poll data
    console.log('hi', this)
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
    // update highchart state with data
  }

  addHolding = () => {
    // console.log(this);
    this.state.config.series[0].data.push(['hi', 0.444]);
    // this.setState({this.state.config.series[0].data: this.config[series[0].data.push(['hi', 0.444])]})
    // this.setState{ config.series[0].data.push(['Blah', .52342])}
  }

  render() {
    // updatePortfolio()]
    // this.addHolding()
    console.log(this.state)
    return (
      <ReactHighcharts config={this.state.config} />
      // <div>
      //   <div className="card">
      //     <div className="card-body">
      //       <h4 className="card-title">Digital Asset Holdings</h4>
      //     </div>
      //   </div>
      // </div>
    )
  }
}

export default DonutChart