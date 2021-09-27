import * as types from './types';

export const setFavoriteDrawer = (object) => ({
  type: types.SET_FAVORITE_DRAWER,
  payload: object,
});

export const setOpenFavoriteDrawer = (boolean) => ({
  type: types.SET_OPEN_FAVORITE_DRAWER,
  payload: boolean,
});

export const setDrawerContent = (string) => ({
  type: types.SET_DRAWER_CONTENT,
  payload: string,
});

export const setFavoriteList = (array) => ({
  type: types.SET_FAVORITE_LIST,
  payload: array,
});

export const setCustomFavoriteList = (array) => ({
  type: types.SET_CUSTOM_FAVORITE_LIST,
  payload: array,
});
