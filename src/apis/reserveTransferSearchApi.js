import userAxios from './axiosConfig';

// 取得轉出帳號
export const getTransferOutAccounts = async (param) => {
  const response = await userAxios
    .post('/api/transfer/queryNtdTrAcct', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
