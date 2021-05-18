import * as types from './types';

/* eslint-disable import/prefer-default-export */
export const setTitle = (string) => ({
  type: types.SET_TITLE,
  payload: string,
});
