import { callAPI } from 'utilities/axios';

// 變更使用者代號
export const changeUserName = async (param) => {
  const response = await callAPI('/api/setting/changeUserName', param);
  return response;
};
