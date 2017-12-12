import React, { Component } from 'react';
import Navbar from './Components/Navbar';
import AllocationsCard from './Components/AllocationsCard';
import PerformanceCard from './Components/PerformanceCard';
import HoldingsTiles from './Components/HoldingsTiles';
import { fetchPoloniexTicker, fetchPoloniexCompleteBalances } from './exchanges/poloniex';

import './App.css';

class App extends Component {
  state = {
    ticker: {},
    balances: {}
  }

  componentDidMount() {
    fetchPoloniexTicker().then(ticker => { this.setState({ ticker }) });
    fetchPoloniexCompleteBalances().then(balances => { this.setState({ balances }) });
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="container">
          <br />
          <div className="row">
            <div className="col-lg-5">
              <AllocationsCard balances={this.state.balances} ticker={this.state.ticker}/>
            </div>
            <div className="col-lg-7">
              <PerformanceCard />
            </div>
          </div>
          <hr />
          <HoldingsTiles ticker={this.state.ticker} />
        </div>
        <br />
      </div>
    );
  }
}

export default App;
