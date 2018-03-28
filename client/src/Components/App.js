import React from 'react';
import { Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';

import Account from '../Components/Account/Account';
import LoginPage from './Account/LoginPage';
import RegisterPage from './Account/RegisterPage';
import Dashboard from '../Components/Dashboard';

// import '../App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    // const { dispatch } = this.props;
    // history.listen((location, action) => {
    //   // clear alert on location change
    //   dispatch(alertActions.clear());
    // });
  }

  render() {
    const { alert } = this.props; // TODO: add success/alert messages
    return (
      <Router history={history}>
        <div>
          {/* <Route exact path="/" component={Dashboard} /> */}
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/demo" component={Dashboard} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <PrivateRoute exact path="/account" component={Account} />
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const { alert } = state;
  return {
    alert,
  };
}

const connectedApp = connect(mapStateToProps)(App);
export default connectedApp;
