import { authHeader } from '../_helpers';

const qs = require('querystring');


export const userService = {
  login,
  logout,
  register,
  getAll,
  getById,
  updatePoloniexCreds,
  verifyPoloniex,
  update,
  delete: _delete,
};


function login(email, password) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify({ email, password }),
  };
  return fetch('/user/login', requestOptions)
    .then(handleResponse)
    .then((response) => {
      if (response.token) {
        localStorage.setItem('user', JSON.stringify(response));
      }
      return response;
    });
}

function logout() {
  // remove user from local storage to log user out and add back demo user
  localStorage.removeItem('user');
}

function register(user) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify(user),
  };
  console.log(requestOptions);
  return fetch('/user/signup', requestOptions)
    .then(handleResponse)
    .then((userResponse) => {
      if (userResponse.token) {
        console.log(user);
        localStorage.setItem('user', JSON.stringify(userResponse));
      }
      console.log(userResponse);
      return userResponse;
    });
}

function updatePoloniexCreds(poloniexKey, poloniexSecret) {
  console.log(qs.stringify({ poloniexKey, poloniexSecret }));
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
    },
    body: qs.stringify({ poloniexKey, poloniexSecret }),
  };
  console.log(requestOptions);
  return fetch('/user/poloniex', requestOptions)
    .then(handleResponse)
    .then((updatedAccount) => {
      return updatedAccount;
    })
    .catch(err => err);
}

function verifyPoloniex() {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
    },
    body: qs.stringify({ poloniexWorks: true }),
  };
  console.log(requestOptions);
  return fetch('/user/verifyPoloniex', requestOptions)
    .then(handleResponse)
    .then((updatedAccount) => {
      return updatedAccount;
    })
    .catch(err => err);
}


function getAll() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch('/users', requestOptions).then(handleResponse);
}

function getById(id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`/users/${id}`, requestOptions).then(handleResponse);
}

function update(user) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  };

  return fetch(`/users/${user.id}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
  };

  return fetch(`/users/${id}`, requestOptions).then(handleResponse);
}

async function handleResponse(response) {
  const res = await response.json();
  return new Promise((resolve, reject) => {
    if (!response.ok) {
      console.log(res);
      reject(res[0].msg); // express-validator error parsing
    } else {
      resolve(res);
    }
  });
}
