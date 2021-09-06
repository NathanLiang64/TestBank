import * as types from './types';

export const setOpenFavoriteDrawer = (boolean) => ({
  type: types.SET_OPEN_FAVORITE_DRAWER,
  payload: boolean,
});

export const setDrawerContent = (string) => ({
  type: types.SET_DRAWER_CONTENT,
  payload: string,
});
