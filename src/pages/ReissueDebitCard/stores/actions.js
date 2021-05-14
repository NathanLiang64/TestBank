import * as types from './types';

/* eslint-disable import/prefer-default-export */
export const setCardValues = (object) => ({
  type: types.SET_CARD_VALUES,
  payload: object,
});

export const setActionText = (value) => ({
  type: types.SET_ACTION_TEXT,
  payload: value,
});

export const setDialogContent = (value) => ({
  type: types.SET_DIALOG_CONTENT,
  payload: value,
});
