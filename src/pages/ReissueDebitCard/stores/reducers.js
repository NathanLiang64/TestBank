import * as types from './types';

const initState = {
  cardValues: {
    account: '04300499001728',
    state: '已啟用',
  },
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_CARD_VALUES:
      return {
        ...state,
        cardValues: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
