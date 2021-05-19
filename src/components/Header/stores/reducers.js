import * as types from './types';

const initState = {
  title: '',
  isHomePage: false,
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_TITLE:
      return {
        ...state,
        title: action.payload,
      };
    case types.SET_IS_HOME_PAGE:
      return {
        ...state,
        isHomePage: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
