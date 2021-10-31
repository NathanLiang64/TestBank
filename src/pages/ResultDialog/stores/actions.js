import * as types from './types';

export const setIsOpen = (boolean) => ({
  type: types.SET_IS_OPEN,
  payload: boolean,
});

export const setCloseCallBack = (func) => ({
  type: types.SET_CLOSE_CALLBACK,
  payload: func,
});

export const setResultContent = (object) => ({
  type: types.SET_RESULT_CONTENT,
  payload: object,
});
