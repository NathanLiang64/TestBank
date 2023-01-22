import { callAPI } from 'utilities/axios';

// 取得金融百貨清單
export const getFinanceStore = async (param) => {
  const response = await callAPI('/function/v1/getFinanceStore', param);
  return response;
};
