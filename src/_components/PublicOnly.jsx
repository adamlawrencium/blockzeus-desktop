import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const checkIfAuthorized = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user);
  if (user) {
    return false;
  }
  return true;
};

export const PublicOnly = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      checkIfAuthorized()
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/dashboard', state: { from: props.location } }} />
    )}
  />
);
