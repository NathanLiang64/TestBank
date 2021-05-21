import * as types from './types';

/* eslint-disable import/prefer-default-export */
export const setIsResultSuccess = (userData) => ({
  type: types.SET_IS_RESULT_SUCCESS,
  payload: userData,
});
