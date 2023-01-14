import { callAPI } from 'utilities/axios';

export const mobileAccountUnbind = async (request) => {
  const response = await callAPI('/api/mobileAccount/v1/unbind', request);
  return response.data;
};

export const getHomeData = async () => {
  const response = await callAPI('/smApi/v1/getHomeData');
  return response;
};

/**
 * register Push Token
 * @param {*} request { pushToken }
 * @returns
 */
export const registerToken = async (request) => {
  const response = await callAPI('/smApi/v1/push/registerToken', request);
  return response;
};
