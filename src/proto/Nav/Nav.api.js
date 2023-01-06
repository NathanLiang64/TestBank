import { callAPI } from 'utilities/axios';

// 登出
export const logout = async () => {
  const response = await callAPI('/auth/logout');
  return response;
};

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

/**
 * log functionTrace
 * @param {*} request {
 *   date: 操作行為時間yyyy-MM-dd HH:mm:ss
 *   functionCode: 操作行為的功能代碼
 *   functionParams: 操作行為的功能資料
 * }
 * @returns
 */
export const functionTrace = async (request) => {
  const response = await callAPI('/smApi/v1/functionTrace', request);
  return response;
};
