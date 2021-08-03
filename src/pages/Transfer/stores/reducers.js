import * as types from './types';

const initState = {
  cards: [],
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_CARDS:
      return {
        ...state,
        cards: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
