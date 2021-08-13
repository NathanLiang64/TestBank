import * as types from './types';

export const setFastLogin = (boolean) => ({
  type: types.SET_FAST_LOGIN,
  payload: boolean,
});

export const setIsPasswordRequired = (boolean) => ({
  type: types.SET_IS_PASSWORD_REQUIRED,
  payload: boolean,
});

export const setResult = (boolean) => ({
  type: types.SET_RESULT,
  payload: boolean,
});
