import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg sticky-top navbar-dark navbar-bz-purple">
        <a className="navbar-brand abs" href="">BlockZeus</a>
        <a className="blockzeus-comment pl-lg-2">Cryptocurrency Manager</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="navbar-collapse collapse" id="collapsingNavbar">

          {/* If user is not logged in */}
          {!localStorage.getItem('user') &&
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="" data-toggle="modal">Sign Up</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="" data-toggle="modal">Log In</a>
              </li>
            </ul>
          }

          {/* If user is logged in */}
          {localStorage.getItem('user') &&
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                {/* <a className="nav-link" href="" data-toggle="modal">Account</a> */}
                <Link to="/account" className="nav-link">Account</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="" data-toggle="modal">Log out</a>
              </li>
            </ul>
          }
        </div>
      </nav>
    );
  }
}
