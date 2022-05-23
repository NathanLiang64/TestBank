import { callAPI } from 'utilities/axios';

// 取得姓名
export const fetchName = async () => {
  const response = await callAPI('/api/setting/custQuery', {});
  return response.data;
};

// 查詢可綁定手機及狀態
export const fetchMobiles = async (param) => {
  const response = await callAPI('/api/mpt/queryMobile', param);
  return response.data;
};

// 取得收款帳號
export const fetchAccounts = async () => {
  const response = await callAPI('/api/deposit/queryBankAcct', {});
  return response.data;
};

// 取得已綁定帳號
export const getUserActNo = async (param) => {
  const response = await callAPI('/api/mpt/userActNo', param);
  return response.data;
};

// 手機號碼收款設定新增
export const createMobileNo = async (param) => {
  const response = await callAPI('/api/mpt/userCreate', param);
  return response.data;
};

// 手機號碼收款設定更新
export const editMobileNo = async (param) => {
  const response = await callAPI('/api/mpt/userChgAcct', param);
  return response.data;
};

// 手機號碼收款設定取消客戶綁定
export const unbindMobileNo = async (param) => {
  const response = await callAPI('/api/mpt/userUnbind', param);
  return response.data;
};
