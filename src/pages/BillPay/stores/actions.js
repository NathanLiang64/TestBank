import * as types from './types';

export const setPayType = (data) => ({
  type: types.SET_PAY_TYPE,
  data,
});

export const setSendType = (data) => ({
  type: types.SET_SEND_TYPE,
  data,
});
