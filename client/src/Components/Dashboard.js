import React, { Component } from 'react';
import { connect } from 'react-redux';

import TwitterFeed from './TwitterFeed/TwitterFeed';
import Navbar from './Site/Navbar';
import DemoAlert from './Site/DemoAlert';
import InfoAlert from './Site/InfoAlert';
import Footer from './Site/Footer';
import AllocationsCard from './Allocations/AllocationsCard';
import PerformanceCard from './Performance/PerformanceCard';
import HoldingsTiles from './Holdings/HoldingsTiles';
import { fetchPoloniexTicker, fetchPoloniexCompleteBalances } from '../API/poloniex';

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

  // If user is not logged in or is a new user, render the info alert
  renderInfoAlert() {
    const { token } = this.props.userInfo.user;
    if (token === 'DEMO') {
      return <InfoAlert />;
    }
    if (!(this.props.userInfo.user.poloniexKey && this.props.userInfo.user.poloniexSecret)) {
      return <InfoAlert />;
    }
  }

  render() {
    console.log(this.props);
    return (
      <div className="App" >
        <Navbar />
        <div className="container-fluid">

          {/* INFO ALERT */}
          {this.renderInfoAlert()}

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
  console.log(state);
  const userInfo = state.authentication.user;
  const { alert } = state;
  return {
    userInfo,
    alert,
  };
}

const connectedDashboardPage = connect(mapStateToProps)(Dashboard);
export default connectedDashboardPage;
