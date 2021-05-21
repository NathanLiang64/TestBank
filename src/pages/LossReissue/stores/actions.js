import * as types from './types';

/* eslint-disable import/prefer-default-export */
export const setAccount = (value) => ({
  type: types.SET_ACCOUNT,
  payload: value,
});

export const setCardState = (value) => ({
  type: types.SET_CARD_STATE,
  payload: value,
});

export const setActionText = (value) => ({
  type: types.SET_ACTION_TEXT,
  payload: value,
});

export const setUserAddress = (value) => ({
  type: types.SET_USER_ADDRESS,
  payload: value,
});

export const setIsResultSuccess = (boolean) => ({
  type: types.SET_IS_RESULT_SUCCESS,
  payload: boolean,
});
