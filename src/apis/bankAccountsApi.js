import userAxios from './axiosConfig';

// 取得帳號列表
export const getAccountsList = async () => {
  const response = await userAxios
    .post('/api/deposit/v1/queryBankAcct')
    .then((data) => data)
    .catch((err) => err);
  return response;
};
