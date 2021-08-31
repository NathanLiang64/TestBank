import * as types from './types';

export const setOpenFavoriteDrawer = (boolean) => ({
  type: types.SET_OPEN_FAVORITE_DRAWER,
  payload: boolean,
});
