import * as types from './types';

const initState = {
  cards: [],
  transferData: {},
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_CARDS:
      return {
        ...state,
        cards: action.payload,
      };
    case types.SET_TRANSFER_DATA:
      return {
        ...state,
        transferData: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
