// in src/restricted.js
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
/**
 * Higher-order component (HOC) to wrap restricted pages
 */
export function BaseComponent() {
  class CheckAuth extends Component {
    componentWillMount() {
      this.checkAuthentication(this.props);
    }
    componentWillReceiveProps(nextProps) {
      if (nextProps.location !== this.props.location) {
        this.checkAuthentication(nextProps);
      }
    }
    checkAuthentication(params) {
      const { history } = params;
      if (!store.getState().auth.token) {
        // history.replace({ pathname: '/login' });
      }
    }
    render() {
      return <BaseComponent {...this.props} />;
    }
  }
  return withRouter(CheckAuth);
}
