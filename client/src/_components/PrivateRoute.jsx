import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const checkIfAuthorized = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user)
  if (user) {
    if (user.token === 'DEMO') {
      return false;
    } else if (!user.token) {
      return false;
    }
    return true;
  }
  return false;
};

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      checkIfAuthorized()
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )}
  />
);
