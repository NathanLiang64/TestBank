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
    default:
      return state;
  }
};

export default reducers;
