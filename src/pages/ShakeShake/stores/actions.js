import * as types from './types';

export const setIsShake = (boolean) => ({
  type: types.SET_IS_SHAKE,
  payload: boolean,
});

export const setUserCards = (array) => ({
  type: types.SET_USER_CARDS,
  payload: array,
});

export const setUserCardInfo = (object) => ({
  type: types.SET_USER_CARD_INFO,
  payload: object,
});
