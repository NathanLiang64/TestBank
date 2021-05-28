import * as types from './types';

const initState = {
  initData: '',
  payData: '',
  sendType: true,
};

const reducers = (state = initState, action) => {
  const { type, data } = action;
  switch (type) {
    case types.SET_INIT_DATA:
      return { ...state, initData: data };
    case types.SET_PAY_DATA:
      return { ...state, payData: data };
    case types.SET_SEND_TYPE:
      return { ...state, sendType: data };
    default:
      return state;
  }
};

export default reducers;
