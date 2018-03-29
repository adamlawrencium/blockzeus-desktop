import { userConstants } from '../_constants';

// See which user is currently set
const user = JSON.parse(localStorage.getItem('user'));

// If user doesn't exist, we assume they're new, and we'll set them to DEMO
// If they exist, then they'll carry on as they left off
let initialState;
if (!user) {
  initialState = { loggedIn: false };
} else {
  // console.log('user found');
  initialState = { loggedIn: true, user };
}

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user,
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT:
      console.log('logged out bro');
      return {
        loggedIn: false,
      };
    default:
      return state;
  }
}
