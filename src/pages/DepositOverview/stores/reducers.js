import * as types from './types';

const initState = {
  cards: [],
  cardInfo: null,
  interestPanelTitle: '優惠利率',
  interestPanelContent: '',
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_CARDS:
      return {
        ...state,
        cards: action.payload,
      };
    case types.SET_CARD_INFO:
      return {
        ...state,
        cardInfo: action.payload,
      };
    case types.SET_INTEREST_PANEL_TITLE:
      return {
        ...state,
        interestPanelTitle: action.payload,
      };
    case types.SET_INTEREST_PANEL_CONTENT:
      return {
        ...state,
        interestPanelContent: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
