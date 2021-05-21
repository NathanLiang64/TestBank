import * as types from './types';

const initState = {
  isResultSuccess: true,
};

const reducers = (state = initState, action) => {
  switch (action.type) {
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
