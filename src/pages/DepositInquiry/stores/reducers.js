import * as types from './types';

const initState = {
  detailList: null,
  openInquiryDrawer: false,
  dateRange: '',
  keywords: [
    { title: '繳卡款', name: 'keywordBill' },
    { title: '轉出', name: 'keywordTransfer' },
    { title: '轉入', name: 'keywordDepositAccount' },
    { title: '利息', name: 'keywordInterest' },
    { title: '付款儲值', name: 'keywordSpend' },
    { title: '薪轉', name: 'keywordSalary' },
  ],
  selectedKeywords: [],
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
    case types.SET_SELECTED_KEYWORDS:
      return {
        ...state,
        selectedKeywords: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
