import React, { Component } from 'react';

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg sticky-top navbar-dark navbar-bz-purple">
        <a className="navbar-brand abs" href="">BlockZeus</a>
        <a className="blockzeus-comment">// Cryptocurrency Manager</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="navbar-collapse collapse" id="collapsingNavbar">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="" data-toggle="modal">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="" data-toggle="modal">Upgrade</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="" data-toggle="modal">Connect to Poloniex</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
