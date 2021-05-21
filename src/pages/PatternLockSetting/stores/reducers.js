import * as types from './types';

const initState = {
  isFirstSetting: false,
  isActive: false,
  isResultSuccess: true,
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_IS_FIRST_SETTING:
      return {
        ...state,
        isFirstSetting: action.payload,
      };
    case types.SET_IS_ACTIVE:
      return {
        ...state,
        isActive: action.payload,
      };
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
