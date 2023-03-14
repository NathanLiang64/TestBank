import { callAPI } from 'utilities/axios';

/**
 * 取得用戶帳本清單
 */
export const getAllLedgers = async () => {
  const response = await callAPI('/ledger/getAllLedgers');
  return response.data;
};
