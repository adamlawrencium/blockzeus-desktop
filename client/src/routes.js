import React from 'react';
import { IndexRoute, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Login from './components/Account/Login';
import Signup from './components/Account/Signup';
import Profile from './components/Account/Profile';
import Forgot from './components/Account/Forgot';
import Reset from './components/Account/Reset';
import CheckAuth from './components/CheckAuth';


import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import thunk from 'redux-thunk'
import promise from 'redux-promise';
import createLogger from 'redux-logger';

import createHistory from 'history/createHashHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import auth from './auth';
// import rootReducer from './reducers';

export default function getRoutes() {
// const MyApp = () => {
  const reducer = combineReducers({
    routing: routerReducer,
    auth,
  });
  const history = createHistory();

  const logger = createLogger();
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(thunk, promise, logger),
  );

  // const store = createStore(reducer, undefined, compose(
  //   applyMiddleware(routerMiddleware(history)),
  //   window.devToolsExtension ? window.devToolsExtension() : f => f,
  // ));

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/dashboard" component={CheckAuth(Dashboard)} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/account" component={CheckAuth(Profile)} />
          <Route path="/forgot" component={Forgot} />
          <Route path="/reset/:token" component={Reset} />
          <Route path="*" component={NotFound} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}
/*
export default function getRoutes(store) {
  // const ensureAuthenticated = (nextState, replace) => {
  //   if (!store.getState().auth.token) {
  //     replace('/login');
  //   }
  // };
  // const skipIfAuthenticated = (nextState, replace) => {
  //   if (store.getState().auth.token) {
  //     replace('/');
  //   }
  // };
  // const clearMessages = () => {
  //   store.dispatch({
  //     type: 'CLEAR_MESSAGES',
  //   });
  // };
  return (
    <Switch>
      <Route exact path="/dashboard" component={CheckAuth(Dashboard)} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/account" component={CheckAuth(Profile)} />
      <Route path="/forgot" component={Forgot} />
      <Route path="/reset/:token" component={Reset} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}
*/


// // // // //

/*
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import rootReducer from '../reducers'

export default function configureStore(initialState) {
  const logger = createLogger();
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, promise, logger)
  );

  return store;
}

*/
