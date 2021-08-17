import * as types from './types';

export const setCards = (array) => ({
  type: types.SET_CARDS,
  payload: array,
});

export const setTransferData = (object) => ({
  type: types.SET_TRANSFER_DATA,
  payload: object,
});
