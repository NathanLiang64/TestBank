import * as types from './types';

const initState = {
  isShake: false,
  userCards: [],
  userCardInfo: null,
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_IS_SHAKE:
      return {
        ...state,
        isShake: action.payload,
      };
    case types.SET_USER_CARDS:
      return {
        ...state,
        userCards: action.payload,
      };
    case types.SET_USER_CARD_INFO:
      return {
        ...state,
        userCardInfo: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
