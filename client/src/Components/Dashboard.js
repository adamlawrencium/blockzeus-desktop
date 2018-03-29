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
    if (authentication.loggedIn && authentication.user.token !== 'DEMO') {
      console.log(authentication);
      if (!authentication.user.accountInfo.poloniexKey) {
        console.log('NO KEYS FOUND BRO');
        return true;
      }
      return false;
    }
  }

  // // If user is not logged in or is a new user, render the info alert
  // renderInfoAlert() {
  //   if (this.props.authentication.user) {
  //     if (this.props.authentication.user.token === 'DEMO') {
  //       return <InfoAlert />;
  //     }
  //   }
  //   return (null);
  // }

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
    if (!this.props.authentication.loggedIn) {
      return (<h1>LOGIN BRO</h1>);
    }
    if (this.detectUserWithoutExchangeKeys()) {
      return (
        <div>

          <Navbar />
          <div className="container-fluid">
            <div className="row">
              <div className="App blurredBackground">
                <div className="blurredBackground" style={{ backgroundImage: `url(${blurredImage})`, height: '100%' }}>
                  {/* <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
              Launch demo modal
            </button> */}
                  <div className="col-12">
                    <div id="demo-modal" className="card text-center mx-auto">
                      <div className="card-header">
                        Welcome to BlockZeus - let's get started!
                      </div>
                      <div className="card-body">
                        <p className="lead">BlockZeus works by integrating with your cryptocurrency exchange. Click on which exchange you'd like to connect first! Alternatively, you can view the demo.</p>
                      </div>
                      <div className="card-footer">
                        <div className="row">
                          <div className="col-5">
                            {/* <a href="#" className="btn btn-info">Connect to Poloniex</a> */}
                            <a href="/account" className="btn btn-block btn-info">Link Poloniex</a>
                          </div>
                          <div className="col-5">
                            {/* <a href="#" className="btn btn-info">Connect to Poloniex</a> */}
                            <a href="/account" className="btn btn-block btn-success">Link Bitfinex (coming soon!)</a>
                          </div>
                          <div className="col-2">
                            <a href="/demo" className="btn btn-block btn-outline-primary">Demo</a>
                            {/* <a href="#" className="btn btn-info">Connect to Bitfinex (coming soon)</a> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="modal show fade" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered h-100 d-flex flex-column justify-content-center my-0" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Welcome to BlockZeus!</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    Thank you for signing up! BlockZeus works by linking your exchange API keys. Head over to your /Account to get started.
                  </div>
                  <div className="modal-footer" id="modal-footer">
                    <div className="col-6">
                      <button type="button" className="btn btn-block btn-primary">Link Exchange</button>
                    </div>
                    <div className="col-6">
                      <button type="button" className="btn btn-block btn-outline-primary">Demo</button>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            </div>

          </div>
        </div>
      );
    }
    return (
      <div className="App" >
        <Navbar />
        <div className="container-fluid">

          {/* NEW USER NO KEYS ALERT */}
          {/* {this.renderNewUserWithoutKeysAlert()} */}
          {this.detectUserWithoutExchangeKeys()}

          {/* INFO ALERT */}
          {/* {this.renderInfoAlert()} */}

          {/* <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
            Launch demo modal
          </button>
          <div className="modal fade" id="exampleModalCenter" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered h-100 d-flex flex-column justify-content-center my-0" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle">Welcome to BlockZeus!</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  Thank you for signing up! BlockZeus works by linking your exchange API keys. Head over to your /Account to get started.
                </div>
                <div className="modal-footer" id="modal-footer">
                  <div className="col-6">
                    <button type="button" className="btn btn-block btn-primary">Link Exchange</button>
                  </div>
                  <div className="col-6">
                    <button type="button" className="btn btn-block btn-outline-primary">View Demo</button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

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
  const { authentication } = state;
  const { alert } = state;
  return {
    authentication,
    alert,
  };
}

const connectedDashboardPage = connect(mapStateToProps)(Dashboard);
export default connectedDashboardPage;
