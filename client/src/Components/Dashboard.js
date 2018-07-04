import React, { Component } from 'react';
import { connect } from 'react-redux';

import TwitterFeed from './TwitterFeed/TwitterFeed';
import Navbar from './Site/Navbar';
import DemoAlert from './Site/DemoAlert';
import InfoAlert from './Site/InfoAlert';
import NoKeysAlert from './Site/NoKeysAlert';
import Footer from './Site/Footer';
import AllocationsCard from './Allocations/AllocationsCard';
import PerformanceCard from './Performance/PerformanceCard';
import HoldingsTiles from './Holdings/HoldingsTiles';
import { fetchPoloniexTicker, fetchPoloniexCompleteBalances } from '../API/poloniex';

import blurredImage from './blurred.png';

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
      .then((balances) => { this.setState({ balances }); })
      .catch(err => console.log(err));
  }

  detectUserWithoutExchangeKeys() {
    const { authentication } = this.props;
    if (authentication.loggedIn && JSON.parse(localStorage.getItem('user')).token !== 'DEMO') {
      if (!authentication.user.poloniexVerified) {
        console.log('NO KEYS FOUND BRO');
        return true;
      }
      return false;
    }
  }

  render() {
    // If user is logged in but doesn't have any keys associated with their account, give them a modal
    if (!this.props.authentication.loggedIn) {
      return (<h1>LOGIN BRO</h1>);
    }
    if (this.detectUserWithoutExchangeKeys()) {
      return (
        <div>
          <Navbar />
          <div className="App">
            <div className="col-12">
              <div id="demo-modal" className="card text-center mx-auto">
                <div className="card-header">
                  Welcome to BlockZeus - let's get started!
                </div>
                <div className="card-body">
                  <p className="lead">BlockZeus syncs with your exchange account to give you a live portfolio dashboard. Click on "Link Poloniex" below to connect now! Alternatively, you can view the demo.</p>
                </div>
                <div className="card-footer">
                  <div className="row">
                    <div className="col-5">
                      <a href="/account" className="btn btn-block btn-info">Link Poloniex</a>
                    </div>
                    <div className="col-5">
                      <a href="/account" className="btn btn-block btn-outline-success disabled" >Link Bitfinex (coming soon!)</a>
                    </div>
                    <div className="col-2">
                      <a href="/demo" className="btn btn-block btn-outline-primary">Demo</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="App" >
        <Navbar />
        <div className="container-fluid">

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

function mapStateToProps(state) {
  const { authentication } = state;
  const { alert } = state;
  return {
    authentication,
    alert,
  };
}

const connectedDashboardPage = connect(mapStateToProps)(Dashboard);
export default connectedDashboardPage;
