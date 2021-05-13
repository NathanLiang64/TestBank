import * as types from './types';

// eslint-disable-next-line import/prefer-default-export
export const setCardValues = (object) => ({
  type: types.SET_CARD_VALUES,
  payload: object,
});
