import React, { Component } from 'react';

class DemoAlert extends Component {
  render() {
    return (
      <div className="alert alert-primary alert-dismissible fade show" role="alert">
        <h5 className="alert-heading">Welcome to BlockZeus!</h5>
        This cryptocurrency manager offers three main features:
            <li><u>Allocations</u> chart which displays the US Dollar value of each holding.</li>
        <li><u>Portfolio Value</u> chart that gives you a historial view of your performance.</li>
        <li><u>Individual Holdings</u> tiles that give you more detailed information on each currency.</li>
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}

export default DemoAlert;
