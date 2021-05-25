import * as types from './types';

const initState = {
  isActive: false,
  isResultSuccess: true,
  type: 1,
};

const reducers = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.SET_IS_ACTIVE:
      return {
        ...state,
        isActive: payload,
      };
    case types.SET_IS_RESULT_SUCCESS:
      return {
        ...state,
        isResultSuccess: payload,
      };
    case types.SET_TYPE:
      return {
        ...state,
        type: payload,
      };
    default:
      return state;
  }
};

export default reducers;
