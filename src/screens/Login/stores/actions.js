import * as types from './types';

export const setUserInfo = (userData) => ({
  type: types.SET_USER_INFO,
  payload: userData,
});

export const setErrorMessage = (message) => ({
  type: types.SET_ERROR_MESSAGE,
  payload: message,
});
