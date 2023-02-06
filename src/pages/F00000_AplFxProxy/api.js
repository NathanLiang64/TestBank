import { callAPI } from 'utilities/axios';

/**
 * 根據申請類別拿取 sse 字串
 * @param {{    prod: String,  }} request
 * @returns {Promise<{   sse: String, }>}
 */
export const getSSE = async (request) => {
  const response = await callAPI('/service/aplfx/v1/getSSE', request);
  return response.data;
};
