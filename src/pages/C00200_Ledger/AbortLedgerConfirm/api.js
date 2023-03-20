import { callAPI } from 'utilities/axios';

// 終止帳本
export const close = async (payload) => {
  const response = await callAPI('/ledger/close', payload);
  return response.data;
};
