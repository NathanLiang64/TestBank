import userAxios, { userRequest } from 'apis/axiosConfig';
import { getMotpStatus } from './settingApi';

// 測試帳號 L158714757

// export const doGetInitData = (apiUrl) => (
//   userAxios.get(apiUrl)
//     .then((response) => response.data)
//     .catch((error) => error.response)
// );

// 查詢轉出帳號 - Adrian
export const getNtdAccounts = (params) => (
  userRequest('post', '/api/transfer/queryNtdTrAcct', params)
);

// 取得 MOTP 狀態
export const getMotpStatusOnTransfer = getMotpStatus;

// 查詢常用帳號 - Adrian
export const getFavAccounts = (params) => (
  userRequest('post', '/api/transfer/queryFavAcct', params)
);

// 查詢約定帳號 - Adrian
export const getRegAccounts = (params) => (
  userRequest('post', '/api/transfer/queryRegAcct', params)
);

// 新增單筆常用帳號 - Adrian
export const addFavAccount = (params) => (
  userRequest('post', '/api/transfer/insertFacAcct', params)
);

// 編輯單筆常用帳號 - Adrian
export const updateFavAccount = (params) => (
  userRequest('post', '/api/transfer/modifyFacAcct', params)
);

// 刪除單筆常用帳號 - Adrian
export const removeFavAccount = (params) => (
  userRequest('post', '/api/transfer/deleteFacAcct', params)
);

// 編輯單筆約定帳號 - Adrian
export const updateRegAccount = (params) => (
  userRequest('post', '/api/transfer/modifyRegAcct', params)
);

// 一般轉帳 (即時轉帳) 確認 - Adrian
export const confirmTransferDetail = (params) => (
  userRequest('post', '/api/transfer/ntdTr/confirm', params)
);

// 一般轉帳 (即時轉帳) - Adrian
export const doTransfer = (params) => (
  userRequest('post', '/api/transfer/ntdTr', params)
);

// 預約轉帳確認 - Jack
export const doBookNtdTrConfirm = async (params) => (
  await userAxios.post('/api/transfer/ntdTr/book/confirm', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);
