import * as types from './types';

const initState = {
  cardValues: {
    account: '04300499001728',
    state: '已掛失',
  },
  actionText: '',
  dialogContent: '',
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_CARD_VALUES:
      return {
        ...state,
        cardValues: action.payload,
      };
    case types.SET_ACTION_TEXT:
      return {
        ...state,
        actionText: action.payload,
      };
    case types.SET_DIALOG_CONTENT:
      return {
        ...state,
        dialogContent: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
