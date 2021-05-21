import * as types from './types';

/* eslint-disable import/prefer-default-export */
export const setIsFirstSetting = (boolean) => ({
  type: types.SET_IS_FIRST_SETTING,
  payload: boolean,
});

export const setIsActive = (boolean) => ({
  type: types.SET_IS_ACTIVE,
  payload: boolean,
});

export const setIsResultSuccess = (boolean) => ({
  type: types.SET_IS_RESULT_SUCCESS,
  payload: boolean,
});
