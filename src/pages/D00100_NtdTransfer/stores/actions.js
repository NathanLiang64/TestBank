import * as types from './types';

export const setOpenDrawer = (object) => ({
  type: types.SET_OPEN_DRAWER,
  payload: object,
});

export const setClickMoreOptions = (object) => ({
  type: types.SET_CLICK_MORE_OPTIONS,
  payload: object,
});

export const setNtdTrAcct = (object) => ({
  type: types.SET_NTD_TR_ACCT,
  payload: object,
});

export const setFqlyUsedAccounts = (object) => ({
  type: types.SET_FREQUENTLY_USED_ACCT,
  payload: object,
});

export const setDgnedAccounts = (object) => ({
  type: types.SET_DESIGNED_ACCT,
  payload: object,
});

export const setAccounts = (array) => ({
  type: types.SET_ACCOUNTS,
  payload: array,
});

export const setFavAccounts = (array) => ({
  type: types.SET_FAV_ACCOUNTS,
  payload: array,
});

export const setRegAccounts = (array) => ({
  type: types.SET_REG_ACCOUNTS,
  payload: array,
});
