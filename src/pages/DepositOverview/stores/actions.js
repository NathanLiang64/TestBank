import * as types from './types';

export const setCards = (array) => ({
  type: types.SET_CARDS,
  payload: array,
});

export const setCardInfo = (object) => ({
  type: types.SET_CARD_INFO,
  payload: object,
});

export const setDetailAreaHeight = (number) => ({
  type: types.SET_DETAIL_AREA_HEIGHT,
  payload: number,
});

export const setComputedCardList = (array) => ({
  type: types.SET_COMPUTED_CARD_LIST,
  payload: array,
});

export const setInterestPanelTitle = (value) => ({
  type: types.SET_INTEREST_PANEL_TITLE,
  payload: value,
});

export const setInterestPanelContent = (value) => ({
  type: types.SET_INTEREST_PANEL_CONTENT,
  payload: value,
});
