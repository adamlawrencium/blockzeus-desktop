import React, { Component } from 'react';
import TwitterFeed from './TwitterFeed/TwitterFeed';
import Navbar from './Site/Navbar';
import DemoAlert from './Site/DemoAlert';
import InfoAlert from './Site/InfoAlert';
import Footer from './Site/Footer';
import AllocationsCard from './Allocations/AllocationsCard';
import PerformanceCard from './Performance/PerformanceCard';
import HoldingsTiles from './Holdings/HoldingsTiles';
import { fetchPoloniexTicker, fetchPoloniexCompleteBalances } from '../API/poloniex';

import './App.css';

class Dashboard extends Component {
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
          <DemoAlert />

          <InfoAlert />

          {/* ALLOCATIONS AND PERFORMANCE */}
          <div className="row d-flex h-100 flex-row">
            <div className="col-lg-5 d-flex flex-column">
              <AllocationsCard balances={this.state.balances} ticker={this.state.ticker} />
            </div>
            <div className="col-lg-7 d-flex flex-column">
              <PerformanceCard />
            </div>
          </div>

          {/* TILES AND TWITTER ROW */}
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

export default Dashboard;
