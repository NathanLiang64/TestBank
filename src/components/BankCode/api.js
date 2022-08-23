import { callAPI } from 'utilities/axios';

/**
 * 查詢銀行代碼
 * @returns
 */
export const getBankCode = async (params) => {
  const response = await callAPI('/api/transfer/queryBank', params);
  return response.data;
};
