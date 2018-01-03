import React, { Component } from 'react';
import TwitterFeed from './Components/TwitterFeed/TwitterFeed';
import Navbar from './Components/Site/Navbar';
import Footer from './Components/Site/Footer';
import AllocationsCard from './Components/Allocations/AllocationsCard';
import PerformanceCard from './Components/Performance/PerformanceCard';
import HoldingsTiles from './Components/Holdings/HoldingsTiles';
import { fetchPoloniexTicker, fetchPoloniexCompleteBalances } from './exchanges/poloniex';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: {},
      balances: {},
    };
  }

  componentDidMount() {
    fetchPoloniexTicker()
      .then((ticker) => { this.setState({ ticker }); })
      .catch((err) => { console.log(err); });

    fetchPoloniexCompleteBalances()
      .then((balances) => { this.setState({ balances }); console.log(balances); })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App" >
        <Navbar />
        <div className="container-fluid">
          
          <div className="alert alert-primary" role="alert">
            Welcome to BlockZeus! This is a demo — <a href="" className="alert-link">sign up</a> and connect to Poloniex to start managing your portfolio.
            And psst, leave feedback <a href="" className="alert-link">here</a> :)
          </div>
          <div className="row">
            <div className="col-lg-5">
              <AllocationsCard balances={this.state.balances} ticker={this.state.ticker} />
            </div>
            <div className="col-lg-7">
              <PerformanceCard />
            </div>
          </div>
          <div className="row" id="poloniex">
            <div className="col-lg-9">
              <HoldingsTiles holdings={this.state.balances} ticker={this.state.ticker} />
            </div>
            <div className="col-lg-3">
              <TwitterFeed />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
