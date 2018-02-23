import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../../_actions';

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    // e.preventDefault();

    console.log('logging out');
    const { dispatch } = this.props;
    dispatch(userActions.logout());
  }

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
                <Redirect to="/login" className="nav-link" href="" data-toggle="modal" Log In />
              </li>
            </ul>
          }

          {/* If user is logged in */}
          {localStorage.getItem('user') &&
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/account" className="nav-link">Account</Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link" href="" data-toggle="modal" onClick={this.handleLogout}>Log out</Link>
              </li>
            </ul>
          }
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  const { loggedIn } = state.authentication;
  console.log(state.authentication);
  return {
    loggedIn,
  };
}

const connectedNavbar = connect(mapStateToProps)(Navbar);
export default connectedNavbar;

