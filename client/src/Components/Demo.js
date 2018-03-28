import React, { Component } from 'react';
import { connect } from 'react-redux';

import TwitterFeed from './TwitterFeed/TwitterFeed';
import Navbar from './Site/Navbar';
import DemoAlert from './Site/DemoAlert';
import InfoAlert from './Site/InfoAlert';
import NoKeysAlert from './Site/NoKeysAlert';
import Footer from './Site/Footer';
import AllocationsCard from './Allocations/AllocationsCard';
import DemoPerformanceCard from './Performance/DemoPerformanceCard';
import HoldingsTiles from './Holdings/HoldingsTiles';
import { fetchPoloniexTicker, fetchDemoPoloniexCompleteBalances } from '../API/poloniex';

import blurredImage from './blurred.png';

class Demo extends Component {
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

    fetchDemoPoloniexCompleteBalances()
      .then((balances) => { this.setState({ balances }); })
      .catch(err => console.log(err));
  }

  detectUserWithoutExchangeKeys() {
    const { authentication } = this.props;
    if (authentication.loggedIn && authentication.user.token !== 'DEMO') {
      console.log(authentication);
      if (!authentication.user.accountInfo.poloniexKey) {
        console.log('NO KEYS FOUND BRO');
      }
    }
  }

  // If user is not logged in or is a new user, render the info alert
  renderInfoAlert() {
    if (!this.props.authentication.loggedIn) {
      return <InfoAlert />;
    }
    return (null);
  }

  // If a user is logged in but doesn't have keys added, render this alert
  // renderNewUserWithoutKeysAlert() {
  //   if (this.props.authentication.loggedIn) {
  //     const { accountInfo } = this.props.authentication.user;
  //     if (!(accountInfo.poloniexKey && accountInfo.poloniexSecret)) {
  //       return <NoKeysAlert />;
  //     }
  //   }
  //   return (null);
  // }

  render() {
    // If user is logged in but doesn't have any keys associated with their account, give them a modal
    // if (!this.props.authentication.loggedIn) {
    //   return (<h1>LOGIN BRO</h1>);
    // }
    return (
      <div className="App" >
        <Navbar />
        <div className="container-fluid">

          {/* NEW USER NO KEYS ALERT */}
          {/* {this.renderNewUserWithoutKeysAlert()} */}
          {this.detectUserWithoutExchangeKeys()}

          {/* INFO ALERT */}
          {this.renderInfoAlert()}

          {/* ALLOCATIONS AND PERFORMANCE */}
          <div className="row d-flex h-100 flex-row">
            <div className="col-lg-5 d-flex flex-column">
              <AllocationsCard balances={this.state.balances} ticker={this.state.ticker} />
            </div>
            <div className="col-lg-7 d-flex flex-column">
              <DemoPerformanceCard />
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
  const { authentication } = state;
  const { alert } = state;
  return {
    authentication,
    alert,
  };
}

const connectedDemo = connect(mapStateToProps)(Demo);
export default connectedDemo;
