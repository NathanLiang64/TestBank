import * as types from './types';

const initState = {
  userInfo: null,
  loginFormValues: {
    showPassword: false,
  },
  errorMessage: '',
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case types.SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.payload,
      };
    case types.SET_LOGIN_FORM_VALUES:
      return {
        ...state,
        loginFormValues: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
