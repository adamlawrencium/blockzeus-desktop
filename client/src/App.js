import React, { Component } from 'react';
import TwitterFeed from './Components/TwitterFeed/TwitterFeed';
import Navbar from './Components/Site/Navbar';
import DemoAlert from './Components/Site/DemoAlert';
import InfoAlert from './Components/Site/InfoAlert';
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
          <DemoAlert />

          <InfoAlert />
          {/* INFO TILES */}
          <div className="row d-flex h-100 flex-row">
            <div className="col d-flex flex-column">
              <div className="card card-body card-section h-100 " >
                <div className="text-muted">Asset count</div>
                <h4>13</h4>
              </div>
            </div>
            <div className="col d-flex flex-column">
              <div className="card card-body card-section h-100 " >
                <div className="text-muted">Value (USD)</div>
                <h4>$1,345</h4>
              </div>
            </div>
            <div className="col d-flex flex-column">
              <div className="card card-body card-section h-100 " >
                <div className="text-muted">24h change</div>
                <h4>15.2%</h4>
              </div>
            </div>
            <div className="col d-flex flex-column">
              <div className="card card-body card-section h-100 " >
                <div className="text-muted">1wk change</div>
                <h4>18.7%</h4>
              </div>
            </div>
          </div>
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

export default App;
