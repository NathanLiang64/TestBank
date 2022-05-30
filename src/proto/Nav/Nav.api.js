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
