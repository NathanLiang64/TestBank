import * as types from './types';

const initState = {
  openFavoriteDrawer: false,
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_OPEN_FAVORITE_DRAWER:
      return {
        ...state,
        openFavoriteDrawer: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
