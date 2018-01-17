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
          {/* DEMO ALERT */}
          <div className="alert alert-info alert-dismissible fade show" role="alert">
            This is a demo — <a href="" className="alert-link">sign up</a> and connect to Poloniex to start managing your portfolio.
            And psst, leave feedback <a href="https://goo.gl/forms/XcIs6gZS4qBphFeA3" target="_blank" className="alert-link">here</a> :)
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {/* INFO ALERT */}
          <div className="alert alert-primary alert-dismissible fade show" role="alert">
            <h5 className="alert-heading">Welcome to BlockZeus!</h5>
            This cryptocurrency manager offers three main features:
            <li><u>Allocations</u> chart which displays the US Dollar value of each holding.</li>
            <li><u>Portfolio Value</u> chart that gives you a historial view of your performance.</li>
            <li><u>Individual Holdings</u> tiles that give you more detailed information on each currency.</li>
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {/* CHARTS, TILES & TWITTER FEED */}
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
