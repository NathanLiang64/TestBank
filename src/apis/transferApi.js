import userAxios from 'apis/axiosConfig';

export const doGetInitData = (apiUrl) => (

  userAxios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);

export const getBankCode = async (params) => (
  await userAxios.post('/api/transfer/queryBank', params)
    .then((response) => response)
    .catch((error) => error)
);

// 查詢轉岀帳號資訊
export const getNtdTrAcct = async (params) => (
  await userAxios.post('/api/transfer/queryNtdTrAcct', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);
// 查詢常用帳號
export const getFavAcct = async (params) => (
  await userAxios.post('/api/transfer/queryFavAcct', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);
// 常用帳號新增
export const insertFacAcct = async (params) => (
  await userAxios.post('/api/transfer/insertFacAcct', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);

// 查詢約定帳號
export const queryRegAcct = async (params) => (
  await userAxios.post('/api/transfer/queryRegAcct', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);
// 轉帳確認
export const doNtdTrConfirm = async (params) => (
  await userAxios.post('/api/transfer/ntdTr/confirm', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);
