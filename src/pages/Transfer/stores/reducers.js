import * as types from './types';

const initState = {
  openDrawer: { title: '常用帳號', content: '', open: false },
  clickMoreOptions: {
    click: false,
    button: '',
    target: null,
    select: { click: false, target: null },
    add: { click: false, target: null },
    edit: { click: false, target: null },
    remove: { click: false, target: null },
  },
  ntdTrAcct: {},
  frequentlyUsedAcct: {},
  designedAcct: {},
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_OPEN_DRAWER:
      return {
        ...state,
        openDrawer: action.payload,
      };
    case types.SET_CLICK_MORE_OPTIONS:
      return {
        ...state,
        clickMoreOptions: action.payload,
      };
    case types.SET_NTD_TR_ACCT:
      return {
        ...state,
        ntdTrAcct: action.payload,
      };
    case types.SET_FREQUENTLY_USED_ACCT:
      return {
        ...state,
        frequentlyUsedAcct: action.payload,
      };
    case types.SET_DESIGNED_ACCT:
      return {
        ...state,
        designedAcct: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
