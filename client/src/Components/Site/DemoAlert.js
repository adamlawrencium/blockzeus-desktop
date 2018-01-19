import React, { Component } from 'react';

class DemoAlert extends Component {
  render() {
    return (
      <div className="alert alert-info alert-dismissible fade show" role="alert">
            This is a demo — <a href="" className="alert-link">sign up</a> and connect to Poloniex to start managing your portfolio.
            And psst, leave feedback <a href="https://goo.gl/forms/XcIs6gZS4qBphFeA3" target="_blank" className="alert-link">here</a> :)
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
    );
  }
}

export default DemoAlert;
