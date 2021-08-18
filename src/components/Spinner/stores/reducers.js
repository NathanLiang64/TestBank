import * as types from './types';

const initState = {
  showSpinner: false,
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_SHOW_SPINNER:
      return {
        ...state,
        showSpinner: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
