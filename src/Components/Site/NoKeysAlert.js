import React, { Component } from 'react';

class NoKeysAlert extends Component {
  render() {
    return (
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        We can't find any exchange API keys added to your account. If you've just signed up, please head to <a href="/account" className="alert-link">Account</a> to add them and view your personal portfolio.
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}

export default NoKeysAlert;
