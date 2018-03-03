import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navbar from '../Site/Navbar';
import { history } from '../../_helpers';
import { testPoloniexIntegration } from '../../API/poloniex';


class Account extends Component {
  constructor(props) {
    super(props);
    // User info:
    let { email, poloniexKey, poloniexSecret } = this.props.userInfo.user;
    if (!poloniexKey) poloniexKey = 'Example: N0VU8XMP-TSDTA4X5-IJFBMXR9-2TBDVRTM';
    if (!poloniexSecret) poloniexSecret = 'Example: db7afa959e27aa111e1f85dd8bb4f776b3c173daea6c056ee6e9d7aa832230547ac188f344f2272979bcef56531a1ed413849504ca92a1ce2758290355d73280';
    this.state = {
      email,
      poloniexKey,
      poloniexSecret,
      testingPoloniex: false,
      testedPoloniex: false,
      poloniexWorks: false,
      poloniexError: false,
    };

    this.handlePoloniexSubmit = this.handlePoloniexSubmit.bind(this);
  }
  handlePoloniexSubmit(e) {
    e.preventDefault();
    this.setState({ testingPoloniex: true });
    testPoloniexIntegration().then((result) => {
      this.setState({ testingPoloniex: false });
      this.setState({ testedPoloniex: true });
      if (result) {
        this.setState({ poloniexWorks: true });
      } else {
        this.setState({ poloniexError: true });
      }
    });
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card card-body card-section panel" >
                <h2 className="card-title">Account Settings</h2>
                <hr />
                <form>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input autoComplete="email" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder={this.state.email} />
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Change Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="8-20 characters" />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Confirm Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="8-20 characters" />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">Save Account Settings</button>
                </form>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card card-body card-section panel" >
                <h2 className="card-title">Exchange Integrations</h2>
                <hr />
                <legend>Poloniex</legend>
                <div className="alert alert-primary alert-dismissible fade show" role="alert">
                  <h5 className="alert-heading">Poloniex Integration Instructions</h5>
                  <u>Note</u>: Throughout these steps, you will likely have to confirm actions for security purposes via emails from Poloniex.
                  <ol>
                    <li>Sign into your Poloniex account.</li>
                    <li>Head to the Settings menu option and click on the &#34;API KEYS.&#34;</li>
                    <li>Click on &#34;Create New Key&#34;. Make sure you <u>uncheck</u> &#34;Enable Trading&#34; and &#34;Enable Withdrawals.&#34;</li>
                    <li>Enter your API Key and API Secret below.</li>
                  </ol>
                  <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form>
                  <div className="row">
                    <div className="col-9">
                      <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Poloniex Key</label>
                        <input type="text" className="form-control" id="exampleInputPassword1" placeholder={this.state.poloniexKey} />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Poloniex Secret</label>
                    <input type="text" className="form-control" id="exampleInputPassword1" placeholder={this.state.poloniexSecret} />
                  </div>
                  <div className="row">
                    <div className="col-3">
                      <button type="submit" className="btn btn-primary" onClick={this.handlePoloniexSubmit}>Save and Sync</button>
                    </div>
                    {this.state.testingPoloniex && (
                      <div className="col-9 my-auto centerBlock">
                        <div className="progress h-100">
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{ width: '100%', height: '100%' }}>Testing Integration...This usually takes a few seconds.</div>
                        </div>
                      </div>
                    )}
                    {this.state.testedPoloniex && this.state.poloniexWorks && (
                      <div className="col-9">
                        <div className="alert alert-success">
                          Poloniex integration works! Head to your <a href="/dashboard">Dashboard</a> and check out your portfolio!
                        </div>
                      </div>
                    )}
                  </div>
                </form>

                {/* <br /> */}

                <hr />

                <legend>Bitfinex (coming soon!)</legend>
                <form>
                  <div className="row">
                    <div className="col-9">
                      <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Bitfinex Key</label>
                        <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Example: N0VU8XMP-TSDTA4X5-IJFBMXR9-2TBDVRTM" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Bitfinex Secret</label>
                    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Example: db7afa959e27aa111e1f85dd8bb4f776b3c173daea6c056ee6e9d7aa832230547ac188f344f2272979bcef56531a1ed413849504ca92a1ce2758290355d73280" />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled>Save and Sync</button>
                </form>
              </div>
            </div>
          </div>
        </div>
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

const connectedAccountPage = connect(mapStateToProps)(Account);
export default connectedAccountPage;
