import { callAPI } from 'utilities/axios';

// 分享帳本明細
export const toShare = async (payload) => {
  const response = await callAPI('/ledger/toShare', payload);
  return response.data;
};
