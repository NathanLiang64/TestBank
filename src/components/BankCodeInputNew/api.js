import { callAPI } from 'utilities/axios';
import { loadLocalData } from 'utilities/Generator';

/**
 * 查詢銀行代碼
 * @returns {Promise<[{
 *  bankNo: 銀行代碼,
 *  bankName: 銀行名稱
 * }]>} 銀行代碼清單。
 */
export const getBankCode = async () => {
  const banks = await loadLocalData('BankList', async () => {
    const response = await callAPI('/api/transfer/queryBank');
    return response.data;
  });
  return banks;
};
