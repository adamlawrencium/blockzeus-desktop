import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const userActions = {
  login,
  logout,
  register,
  updatePoloniex,
  poloniexWorks,
  poloniexFails,
  getAll,
  delete: _delete,
};

function login(email, password) {
  return (dispatch) => {
    dispatch(request({ email }));

    userService.login(email, password)
      .then(
        (user) => {
          dispatch(success(user));
          history.push('/dashboard');
        },
        (error) => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        },
      );
  };

  function request(user) { return { type: userConstants.LOGIN_REQUEST, user }; }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user }; }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error }; }
}

function logout() {
  userService.logout();
  history.push('/login');
  return { type: userConstants.LOGOUT, user: {} };
}

function register(user) {
  return (dispatch) => {
    dispatch(request(user));

    userService.register(user)
      .then((user) => {
        console.log(localStorage);
        dispatch(success(user));
        console.log(localStorage);
        history.push('/dashboard');
        dispatch(alertActions.success('Registration successful'));
      })
      .catch((error) => {
        console.log('userService', error);
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      });
  };

  function request(user) { return { type: userConstants.REGISTER_REQUEST, user }; }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user }; }
  function failure(error) { return { type: userConstants.REGISTER_FAILURE, error }; }
}


function updatePoloniex(poloniexKey, poloniexSecret) {
  return (dispatch) => {
    userService.updatePoloniexCreds(poloniexKey, poloniexSecret).then((updatedAccount) => {
      // console.log('updated creds', updatedAccount);
      console.log(updatedAccount);
      dispatch(success(updatedAccount));
    });
  };

  function request(user) { return { type: userConstants.POLO_UPDATE_REQUEST, user }; }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user }; }
  function failure(error) { return { type: userConstants.POLO_TEST_FAILURE, error }; }
}

// Move this to its own reducer. This returns a user because this reducer needs it
function poloniexWorks(poloniexKey, poloniexSecret) {
  return (dispatch) => {
    userService.verifyPoloniex().then((updatedAccount) => {
      console.log(updatedAccount);
      dispatch(success(updatedAccount));
    });
  };

  function success(user) { return { type: 'POLONIEXWORKS', user }; }
}
// Move this to its own reducer. This returns a user because this reducer needs it
function poloniexFails(poloniexKey, poloniexSecret) {
  return (dispatch) => {
    userService.verifyPoloniex().then((updatedAccount) => {
      console.log(updatedAccount);
      dispatch(fail(updatedAccount));
    });
  };

  function fail(user) { return { type: 'POLONIEXFAILS', user }; }
}


function getAll() {
  return (dispatch) => {
    dispatch(request());

    userService.getAll()
      .then(
        users => dispatch(success(users)),
        error => dispatch(failure(error)),
      );
  };

  function request() { return { type: userConstants.GETALL_REQUEST }; }
  function success(users) { return { type: userConstants.GETALL_SUCCESS, users }; }
  function failure(error) { return { type: userConstants.GETALL_FAILURE, error }; }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return (dispatch) => {
    dispatch(request(id));

    userService.delete(id)
      .then(
        (user) => {
          dispatch(success(id));
        },
        (error) => {
          dispatch(failure(id, error));
        },
      );
  };

  function request(id) { return { type: userConstants.DELETE_REQUEST, id }; }
  function success(id) { return { type: userConstants.DELETE_SUCCESS, id }; }
  function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error }; }
}
