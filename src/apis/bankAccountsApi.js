import userAxios from './axiosConfig';

// 取得帳號列表
export const getAccountsList = async (param) => {
  const response = await userAxios
    .post('/api/deposit/queryBankAcct', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
