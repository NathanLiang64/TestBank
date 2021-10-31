import * as types from './types';

const initState = {
  isOpen: false,
  closeCallBack: () => {},
  resultContent: {
    isSuccess: true,
    successTitle: '',
    successDesc: '',
    errorTitle: '',
    errorCode: '-',
    errorDesc: '',
  },
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_IS_OPEN:
      return {
        ...state,
        isOpen: action.payload,
      };
    case types.SET_CLOSE_CALLBACK:
      return {
        ...state,
        closeCallBack: action.payload,
      };
    case types.SET_RESULT_CONTENT:
      return {
        ...state,
        resultContent: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
