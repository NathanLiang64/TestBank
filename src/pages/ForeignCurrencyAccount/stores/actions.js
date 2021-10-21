import * as types from './types';

export const setDebitCards = (array) => ({
  type: types.SET_DEBIT_CARDS,
  payload: array,
});

export const setSelectedAccount = (object) => ({
  type: types.SET_SELECTED_ACCOUNT,
  payload: object,
});

export const setTransactionDetails = (array) => ({
  type: types.SET_TXN_DETAILS,
  payload: array,
});

export const setTransactionMonthly = (array) => ({
  type: types.SET_TXN_MONTHLY,
  payload: array,
});
