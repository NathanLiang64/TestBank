import * as types from './types';

const initState = {
  favoriteDrawer: {
    title: '我的最愛',
    content: '',
    open: false,
    back: null,
  },
  openFavoriteDrawer: false,
  drawerContent: '',
  favoriteList: [],
  customFavoriteList: [],
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_FAVORITE_DRAWER:
      return {
        ...state,
        favoriteDrawer: action.payload,
      };
    case types.SET_OPEN_FAVORITE_DRAWER:
      return {
        ...state,
        openFavoriteDrawer: action.payload,
      };
    case types.SET_DRAWER_CONTENT:
      return {
        ...state,
        drawerContent: action.payload,
      };
    case types.SET_FAVORITE_LIST:
      return {
        ...state,
        favoriteList: action.payload,
      };
    case types.SET_CUSTOM_FAVORITE_LIST:
      return {
        ...state,
        customFavoriteList: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
