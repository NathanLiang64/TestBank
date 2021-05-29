import * as types from './types';

const initState = {
  cards: [],
  cardInfo: null,
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_CARDS:
      return {
        ...state,
        cards: action.payload,
      };
    case types.SET_CARD_INFO:
      return {
        ...state,
        cardInfo: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
