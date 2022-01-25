import userAxios from './axiosConfig';

// 取得轉出帳號
export const getTransferOutAccounts = async (param) => {
  const response = await userAxios
    .post('/api/transfer/queryNtdTrAcct', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 查詢預約轉帳明細
export const getReservedTransDetails = async (param) => {
  const response = await userAxios
    .post('/api/transfer/reserved/transDetails', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 查詢預約轉帳結果明細
export const getResultTransDetails = async (param) => {
  const response = await userAxios
    .post('/api/transfer/reserved/resultDetails', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
