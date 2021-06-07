import * as types from './types';

export const setCurrentMonthDetailList = (array) => ({
  type: types.SET_CURRENT_MONTH_DETAIL_LIST,
  payload: array,
});

export const setOpenInquiryDrawer = (boolean) => ({
  type: types.SET_OPEN_INQUIRY_DRAWER,
  payload: boolean,
});

export const setDateRange = (value) => ({
  type: types.SET_DATE_RANGE,
  payload: value,
});

export const setSelectedKeywords = (array) => ({
  type: types.SET_SELECTED_KEYWORDS,
  payload: array,
});
