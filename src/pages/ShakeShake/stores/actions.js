import * as types from './types';

export const setCards = (array) => ({
  type: types.SET_CARDS,
  payload: array,
});

export const setCardInfo = (object) => ({
  type: types.SET_CARD_INFO,
  payload: object,
});
