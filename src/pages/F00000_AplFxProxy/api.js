import { callAPI } from 'utilities/axios';

/**
 * 建立台幣轉帳交易，需再完成交易確認才會真的執行轉帳。
 * @param {{    prod: '申請代號',  }} request
 * @returns {Promise<{   sse: 'encode 的個資', }>}
 */
export const getSSE = async (request) => {
  const response = await callAPI('/api/app2apply/v1/getSSE', request);
  return response.data;
};
