import React, { Component } from 'react';
import Navbar from './Components/Navbar';
import AllocationsCard from './Components/AllocationsCard';
import PerformanceCard from './Components/PerformanceCard';
import HoldingsTiles from './Components/HoldingsTiles';
import fetchPoloniexData from './exchanges/poloniex';

import './App.css';

class App extends Component {
  state = {
    data: {},
    holdings: {}
  }

  componentDidMount() {
    fetchPoloniexData().then(data => {
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
              <PerformanceCard />
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
