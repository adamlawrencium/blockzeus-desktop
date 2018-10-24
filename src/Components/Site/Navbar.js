import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../../_helpers';

import { userActions } from '../../_actions';

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
    this.handleDirectToLogin = this.handleDirectToLogin.bind(this);
  }

  handleLogout() {
    // e.preventDefault();

    console.log('logging out');
    const { dispatch } = this.props;
    dispatch(userActions.logout());
    // history.push('/demo');
  }

  handleDirectToLogin() {
    history.push('/login');
  }
  handleDirectToSignup() {
    history.push('/register');
  }


  renderNavItems() {
    const path = window.location.pathname;
    // If user is loggedin
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          {/* <Link to="/dashboard" className={`nav-link ${path === '/dashboard' ? 'active' : ''}`}>Dashboard</Link> */}
        </li>
        <li className="nav-item mr-5">
          Settings
          {/* <Link to="/account" className={`nav-link ${path === '/account' ? 'active' : ''}`}>Account</Link> */}
        </li>
      </ul>
    );
  }


  render() {
    return (
      <nav className="navbar navbar-light navbar-expand-lg sticky-top  navbar-bz-purple" style={{ "-webkit-app-region": "drag" }}>
        {/* <Link to={localStorage.getItem('user') ? '/dashboard' : '/dashboard'} className="navbar-brand abs" href="">BlockZeus</Link> */}
        <a className="blockzeus-comment pl-lg-2">BlockZeus // Cryptocurrency Manager</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="navbar-collapse collapse" id="collapsingNavbar">

          {/* If user is not logged in, TODO: handling auth logic redirects in Navbar doesn't seem right..., fix */}
          {this.renderNavItems()}


          {/* If user is logged in */}
          {/* {localStorage.getItem('user') &&
          } */}
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  const { loggedIn } = state.authentication;
  // console.log(state);
  // console.log(state.authentication);
  return {
    loggedIn,
  };
}

const connectedNavbar = connect(mapStateToProps)(Navbar);
export default connectedNavbar;

