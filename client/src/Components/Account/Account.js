import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navbar from '../Site/Navbar';
import { history } from '../../_helpers';
import { userService } from '../../_services/user.service';
import { userActions } from '../../_actions';
import { testPoloniexIntegration, verifyPoloniex } from '../../API/poloniex';


class Account extends Component {
  constructor(props) {
    super(props);
    // User info:
    let { email, poloniexKey, poloniexSecret } = this.props.authentication.user.user;
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

    this.handleChange = this.handleChange.bind(this);
    this.handlePoloniexSubmit = this.handlePoloniexSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  async handlePoloniexSubmit(e) {
    e.preventDefault();
    this.setState({ testingPoloniex: true });

    const { dispatch } = this.props;

    // await dispatch(userActions.updatePoloniex(this.state.poloniexKey, this.state.poloniexSecret));
    userService.updatePoloniexCreds(this.state.poloniexKey, this.state.poloniexSecret).then((updatedAccount) => {
      // test integration. if doesn't work, user will simply have to fix it themself
      dispatch(userActions.updatePoloniex(updatedAccount));
      testPoloniexIntegration()
        .then((worked) => {
          // send another request to verify poloniex - refactor this!
          userService.verifyPoloniex().then((res) => {
            dispatch(userActions.poloniexWorks());
            this.setState({ testingPoloniex: false });
            this.setState({ testedPoloniex: true });
            this.setState({ poloniexWorks: true });
          });
        })
        .catch((error) => {
          console.log('error caught', error);
          dispatch(userActions.poloniexFails());
          this.setState({ testingPoloniex: false });
          this.setState({ testedPoloniex: true });
          this.setState({ poloniexWorks: false });
        });
    });
    

      console.log('finished test poloneix integration')
  }

  renderPoloniexErrorAlert() {
    if (this.state.testingPoloniex) {
      return (null);
    }
    if (this.state.testedPoloniex && this.state.poloniexWorks) {
      return (
        <div className="col-9">
          <div className="alert alert-success">
            Poloniex integration works! Head to your <a href="/dashboard">Dashboard</a> and check out your portfolio!
          </div>
        </div>
      );
    }
    if (this.state.testedPoloniex && !this.state.poloniexWorks) {
      return (
        <div className="col-9">
          <div className="alert alert-danger">
            Uh oh, looks like Poloniex rejected that Key/Secret pair. Make sure both are correct.
            Otherwise you can generate a new pair and try again - that usually fixes it! If that still does not work
            send an email to support@blockzeus.com and we will get back to you within 48 hours.
          </div>
        </div>
      );
    }
    return (null);
  }

  render() {
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
                    <label>Email address</label>
                    <input autoComplete="email" type="email" name="email" className="form-control" aria-describedby="emailHelp" value={this.state.email} onChange={this.handleChange} />
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label>Change Password</label>
                        <input type="password" className="form-control" placeholder="8-20 characters" />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" className="form-control" placeholder="8-20 characters" />
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
                  <u>Note</u>: Throughout these steps, Poloniex will likely send you confirmation emails for security purposes.
                  <ol>
                    <li>Sign into your Poloniex account.</li>
                    <li>Head to the Settings menu option and click on the &#34;API KEYS.&#34;</li>
                    <li>Click on &#34;Create New Key&#34;. Make sure you <b>uncheck</b> &#34;Enable Trading&#34; and &#34;Enable Withdrawals.&#34;</li>
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
                        <label>Poloniex Key</label>
                        <input type="text" className="form-control" name="poloniexKey" value={this.state.poloniexKey} onChange={this.handleChange} />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Poloniex Secret</label>
                    <input type="text" className="form-control" name="poloniexSecret" value={this.state.poloniexSecret} onChange={this.handleChange} />
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
                    {this.renderPoloniexErrorAlert()}
                  </div>
                </form>

                {/* <br /> */}

                <hr />

                <legend>Bitfinex (coming soon!)</legend>
                <form>
                  <div className="row">
                    <div className="col-9">
                      <div className="form-group">
                        <label htmlFor="exampleInputPassword2">Bitfinex Key</label>
                        <input type="text" className="form-control" placeholder="Example: N0VU8XMP-TSDTA4X5-IJFBMXR9-2TBDVRTM" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword2">Bitfinex Secret</label>
                    <input type="text" className="form-control" placeholder="Example: db7afa959e27aa111e1f85dd8bb4f776b3c173daea6c056ee6e9d7aa832230547ac188f344f2272979bcef56531a1ed413849504ca92a1ce2758290355d73280" />
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
  const { authentication } = state;
  const { alert } = state;
  return {
    authentication,
    alert,
  };
}

const connectedAccountPage = connect(mapStateToProps)(Account);
export default connectedAccountPage;
