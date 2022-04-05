import { callAPI } from 'utilities/axios';

// 登出
export const logout = async () => {
  const response = await callAPI('/auth/logout');
  return response;
};
