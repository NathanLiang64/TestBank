import * as types from './types';

export const setCards = (array) => ({
  type: types.SET_CARDS,
  payload: array,
});

export const setFrequentlyUsedAccounts = (array) => ({
  type: types.SET_FREQUENTLY_USED_ACCOUNTS,
  payload: array,
});

export const setDesignedAccounts = (array) => ({
  type: types.SET_DESIGNED_ACCOUNTS,
  payload: array,
});

export const setTransferData = (object) => ({
  type: types.SET_TRANSFER_DATA,
  payload: object,
});

export const setOpenDrawer = (object) => ({
  type: types.SET_OPEN_DRAWER,
  payload: object,
});

export const setClickMoreOptions = (object) => ({
  type: types.SET_CLICK_MORE_OPTIONS,
  payload: object,
});
