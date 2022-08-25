import { callAPI } from 'utilities/axios';

/**
 * 查詢銀行代碼
 * @returns {
 *   bankNo: 銀行代碼。
 *   bankName: 銀行名稱。
 * }
 * @returns
 */
export const getBankCode = async (params) => {
  const response = await callAPI('/api/transfer/queryBank', params);
  return response.data;
};
