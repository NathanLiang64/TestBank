import { callAPI } from 'utilities/axios';

// email 發送數位存摺
export const sendBankBookMail = async (param) => {
  const response = await callAPI('/api/deposit/v1/sendAcctTxDtl', param);
  return response;
};

// 取得 E-mail
export const getEmail = async (param) => {
  const response = await callAPI('/api/setting/custQuery', param);
  return response;
};
