import * as types from './types';

const initState = {
  debitCards: [],
  selectedAccount: {},
  txnDetails: [],
  txnMonthly: [],
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_DEBIT_CARDS:
      return {
        ...state,
        debitCards: action.payload,
      };
    case types.SET_SELECTED_ACCOUNT:
      return {
        ...state,
        selectedAccount: action.payload,
      };
    case types.SET_TXN_DETAILS:
      return {
        ...state,
        txnDetails: action.payload,
      };
    case types.SET_TXN_MONTHLY:
      return {
        ...state,
        txnMonthly: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
