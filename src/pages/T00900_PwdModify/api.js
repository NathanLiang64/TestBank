import { callAPI } from 'utilities/axios';

// 變更網銀密碼
export const changePwd = async (param) => {
  const response = await callAPI('/api/setting/modifyPwd', param);
  return response;
};
