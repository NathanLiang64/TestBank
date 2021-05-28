import * as types from './types';

export const setInitData = (data) => ({
  type: types.SET_INIT_DATA,
  data,
});

export const setPayData = (data) => ({
  type: types.SET_PAY_DATA,
  data,
});

export const setSendType = (data) => ({
  type: types.SET_SEND_TYPE,
  data,
});
