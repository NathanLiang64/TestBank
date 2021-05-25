import * as types from './types';

export const setIsActive = (boolean) => ({
  type: types.SET_IS_ACTIVE,
  payload: boolean,
});

export const setIsResultSuccess = (boolean) => ({
  type: types.SET_IS_RESULT_SUCCESS,
  payload: boolean,
});

export const setType = (number) => ({
  type: types.SET_TYPE,
  payload: number,
});
