import * as types from './types';

export const setCards = (array) => ({
  type: types.SET_CARDS,
  payload: array,
});
