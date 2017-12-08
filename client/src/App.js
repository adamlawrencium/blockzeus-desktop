import React, { Component } from 'react';
import Navbar from './Navbar';
import AllocationsCard from './AllocationsCard';
import PerformanceCard from './PerformanceCard';
import HoldingsTiles from './HoldingsTiles';

import './App.css';

class App extends Component {
  state = {
    data: {},
    holdings: {}
  }

  componentDidMount() {
    fetch('/poloniexData/ticker')
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        this.setState({ data });
      });
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="container">
          <br />
          <div className="row">
            <div className="col-lg-5">
              <AllocationsCard />
            </div>
            <div className="col-lg-7">
              <PerformanceCard/>
            </div>
          </div>
          <hr />
          <br />
          <HoldingsTiles ticker={this.state.data} />
        </div>
        <br />
      </div>
    );
  }
}

export default App;
