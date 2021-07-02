import * as types from './types';

export const setDetailList = (object) => ({
  type: types.SET_DETAIL_LIST,
  payload: object,
});

export const setOpenInquiryDrawer = (boolean) => ({
  type: types.SET_OPEN_INQUIRY_DRAWER,
  payload: boolean,
});

export const setDateRange = (value) => ({
  type: types.SET_DATE_RANGE,
  payload: value,
});

export const setKeywords = (array) => ({
  type: types.SET_KEYWORDS,
  payload: array,
});

export const setCustomKeyword = (value) => ({
  type: types.SET_CUSTOM_KEYWORD,
  payload: value,
});
