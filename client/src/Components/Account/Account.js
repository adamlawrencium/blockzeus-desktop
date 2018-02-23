import React, { Component } from 'react';
import Navbar from '../Site/Navbar';

export default class Account extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card card-body card-section panel" >
                <h2 className="card-title">Account</h2>
                <hr />
                <form className="form-horizontal">
                  <legend>Profile Information</legend>
                  <div className="form-group">
                    <label htmlFor="email" className="col-sm-3 float-none">Email</label>
                    <div className="col-sm-8">
                      <input type="email" name="email" id="email" className="form-control" value={'this.state.email'} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="name" className="col-sm-3">Name</label>
                    <div className="col-sm-8">
                      <input type="text" name="name" id="name" className="form-control" value={'this.state.name'} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="location" className="col">Poloniex Key</label>
                    <div className="col">
                      <input type="text" name="location" id="location" className="form-control" value={'this.state.location'} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="location" className="col">Poloniex Secret</label>
                    <div className="col">
                      <input type="text" name="location" id="location" className="form-control" value={'this.state.location'} />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-sm-offset-3 col-sm-4">
                      <button type="submit" className="btn btn-success">Update Profile</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card card-body card-section panel" >
                <h2 className="card-title">Exchanges</h2>
                <hr />
                <form className="form-horizontal">
                  <legend>Poloniex</legend>
                  <div className="form-group">
                    <label htmlFor="location" className="col">Key</label>
                    <div className="col">
                      <input type="text" name="location" id="location" className="form-control" value={'this.state.location'} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="location" className="col">Secret</label>
                    <div className="col">
                      <input type="text" name="location" id="location" className="form-control" value={'this.state.location'} />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-sm-offset-3 col-sm-4">
                      <button type="submit" className="btn btn-success">Update Poloniex</button>
                    </div>
                  </div>
                  </form>
                <form className="form-horizontal">
                  <legend>Bitfinex</legend>
                  <div className="form-group">
                    <label htmlFor="location" className="col">Key</label>
                    <div className="col">
                      <input type="text" name="location" id="location" className="form-control" value={'Coming soon!'} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="location" className="col">Secret</label>
                    <div className="col">
                      <input type="text" name="location" id="location" className="form-control" value={'Coming soon!'} />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-sm-offset-3 col-sm-4">
                      <button type="submit" disabled className="btn btn-success">Update Bitfinex</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
