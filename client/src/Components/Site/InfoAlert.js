import React, { Component } from 'react';

class DemoAlert extends Component {
  render() {
    return (
      <div className="alert alert-primary alert-dismissible fade show" role="alert">
        <h5 className="alert-heading">Welcome to BlockZeus!</h5>
        This dashboard is currently using our demo portfolio. If you've just signed up, head to your <a href="/account" className="alert-link">Account</a> to add your exchange keys!
        <p>Your BlockZeus cryptocurrency manager offers four main features:
            <li><b>Allocations</b> chart which displays the US Dollar value of each holding.</li>
          <li><b>Portfolio Value</b> chart that gives you a historial view of your performance.</li>
          <li><b>Individual Holdings</b> tiles that give you more detailed information on each currency.</li>
          <li><b> Current News </b> by @coindesk (configurable from your account)</li>
        </p>
        <p>If you have any questions or comments reach out to adam@blockzeus.com, or leave feedback <a href="https://goo.gl/forms/XcIs6gZS4qBphFeA3" target="_blank" className="alert-link">here</a> :)</p>

        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}

export default DemoAlert;
