import userAxios from './axiosConfig';

// 取得帳號列表
export const getAccountsList = async (param) => {
  const response = await userAxios
    .post('/api/deposit/queryBankAcct', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// email 發送數位存摺
export const sendBankBookMail = async (param) => {
  const response = await userAxios
    .post('/api/deposit/sendAcctTxDtl', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
