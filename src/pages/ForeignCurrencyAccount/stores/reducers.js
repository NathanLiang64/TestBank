import * as types from './types';

const initState = {
  selectedAccount: {},
  txnDetails: [],
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_SELECTED_ACCOUNT:
      return {
        ...state,
        selectedAccount: action.payload,
      };
    case types.SET_TRANSACTION_DETAILS:
      return {
        ...state,
        txnDetails: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
