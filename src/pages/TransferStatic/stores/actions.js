import * as types from './types';

export const setOpenDrawer = (object) => ({
  type: types.SET_OPEN_DRAWER,
  payload: object,
});

export const setClickMoreOptions = (object) => ({
  type: types.SET_CLICK_MORE_OPTIONS,
  payload: object,
});
