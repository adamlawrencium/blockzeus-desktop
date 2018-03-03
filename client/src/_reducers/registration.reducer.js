import { userConstants } from '../_constants';

// const demoUser = { user: { token: 'DEMO' } };
// localStorage.setItem('user', JSON.stringify(demoUser));
// initialState = { loggedIn: false, user: { user: { token: 'DEMO' } } };

export function registration(state = {}, action) {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return { registering: true };
    case userConstants.REGISTER_SUCCESS:
      return { loggedIn: true, user: { user: { token: 'DEMO' } } };
    case userConstants.REGISTER_FAILURE:
      return {};
    default:
      return state;
  }
}
