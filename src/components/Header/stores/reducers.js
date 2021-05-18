import * as types from './types';

const initState = {
  title: '',
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_TITLE:
      return {
        ...state,
        title: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
