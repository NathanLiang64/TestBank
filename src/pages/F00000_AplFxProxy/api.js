import { callAPI } from 'utilities/axios';

/**
 * 根據申請類別拿取 sse 字串
 * @param {{    prod: '申請代號',  }} request
 * @returns {Promise<{   sse: 'encode 的個資', }>}
 */
export const getSSE = async (request) => {
  const response = await callAPI('/api/app2apply/v1/getSSE', request);
  return response.data;
};
