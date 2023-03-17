import { callAPI } from 'utilities/axios';

/**
 * Bankee會員登入帳本
 */
export const start = async () => {
  const response = await callAPI('/ledger/start');
  return response.data;
};

/**
 * 取得用戶帳本清單
 */
export const getAllLedgers = async () => {
  const response = await callAPI('/ledger/getAllLedgers');
  return response.data;
};
