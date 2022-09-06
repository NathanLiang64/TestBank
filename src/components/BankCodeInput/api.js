import { callAPI } from 'utilities/axios';
import { loadLocalData } from 'utilities/Generator';

/**
 * 查詢銀行代碼
 * @returns {
 *   bankNo: 銀行代碼。
 *   bankName: 銀行名稱。
 * }
 */
export const getBankCode = async (params) => {
  const banks = await loadLocalData('BankList', async () => {
    const response = await callAPI('/api/transfer/queryBank', params);
    return response.data;
  });
  return banks;
};
