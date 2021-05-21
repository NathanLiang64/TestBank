import * as types from './types';

const initState = {
  account: '',
  state: '',
  actionText: '',
  address: '',
  isResultSuccess: true,
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_ACCOUNT:
      return {
        ...state,
        account: action.payload,
      };
    case types.SET_CARD_STATE:
      return {
        ...state,
        state: action.payload,
      };
    case types.SET_ACTION_TEXT:
      return {
        ...state,
        actionText: action.payload,
      };
    case types.SET_USER_ADDRESS:
      return {
        ...state,
        address: action.payload,
      };
    case types.SET_IS_RESULT_SUCCESS:
      return {
        ...state,
        isResultSuccess: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
