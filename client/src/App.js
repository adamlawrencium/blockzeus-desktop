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
    fetchPoloniexTicker()
      .then(ticker => { this.setState({ ticker }) })
      .catch(err => { console.log(err); });

    fetchPoloniexCompleteBalances()
      .then(balances => { this.setState({ balances }) })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App" >
        <Navbar />
        <div className="container-fluid">
          <br />
          <div className="alert alert-primary" role="alert">
            This is a demo! <a href="#" className="alert-link">Sign up</a> and connect to Poloniex to start managing your portfolio!
          </div>
          <div className="row">
            <div className="col-lg-5">
              <AllocationsCard balances={this.state.balances} ticker={this.state.ticker} />
            </div>
            <div className="col-lg-7">
              <PerformanceCard balances={this.state.balances} ticker={this.state.ticker} />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <HoldingsTiles holdings={this.state.balances} ticker={this.state.ticker} />
            </div>
          </div>
        </div>
        <br />
      </div>
    );
  }
}

export default App;
