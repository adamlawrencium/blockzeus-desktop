// import React from 'react';
import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
// import { Router, browserHistory } from 'react-router-dom';
// import configureStore from './store/configureStore';
// import getRoutes from './routes';

// const store = configureStore(window.INITIAL_STATE);

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('app'),
// );


import React from 'react';
// import { render } from 'react-dom';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';


import { store, configureFakeBackend } from './_helpers';
import { App } from './App';
// import Dashboard from './Components/Dashboard';

// setup fake backend
configureFakeBackend();

ReactDOM.render(
  <Provider store={store}>
    <App />
    {/* <Dashboard /> */}
  </Provider>,
  document.getElementById('root'),
);
