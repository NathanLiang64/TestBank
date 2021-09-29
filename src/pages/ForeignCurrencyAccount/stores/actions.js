import * as types from './types';

export const setSelectedAccount = (object) => ({
  type: types.SET_SELECTED_ACCOUNT,
  payload: object,
});

export const setTransactionDetails = (array) => ({
  type: types.SET_TRANSACTION_DETAILS,
  payload: array,
});
