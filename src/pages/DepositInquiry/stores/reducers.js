import * as types from './types';

const initState = {
  detailList: [],
  openInquiryDrawer: false,
  dateRange: [],
  tempDateRange: [],
  keywords: [],
  customKeyword: '',
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_DETAIL_LIST:
      return {
        ...state,
        detailList: action.payload,
      };
    case types.SET_OPEN_INQUIRY_DRAWER:
      return {
        ...state,
        openInquiryDrawer: action.payload,
      };
    case types.SET_DATE_RANGE:
      return {
        ...state,
        dateRange: action.payload,
      };
    case types.SET_TEMP_DATE_RANGE:
      return {
        ...state,
        tempDateRange: action.payload,
      };
    case types.SET_KEYWORDS:
      return {
        ...state,
        keywords: action.payload,
      };
    case types.SET_CUSTOM_KEYWORD:
      return {
        ...state,
        customKeyword: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
