import userAxios, { userRequest } from 'apis/axiosConfig';
import { getMotpStatus } from './settingApi';

export const doGetInitData = (apiUrl) => (
  userAxios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);

// 查詢轉出帳號 - Adrian
export const getNtdAccounts = (params) => (
  userRequest('post', '/api/transfer/queryNtdTrAcct', params)
);

// 取得 MOTP 狀態
export const getMotpStatusOnTransfer = getMotpStatus;
// "custId": "J230265485",
// "deviceId": "675066ee-2f25-4d97-812a-12c7f8d18489"

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

export const confirmTransferDetail = (params) => (
  userRequest('post', '/api/transfer/ntdTr/confirm', params)
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

// 常用帳號刪除(單筆)
export const doDeleteFacAcct = async (params) => (
  await userAxios.post('/api/transfer/deleteFacAcct', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);

// 預約轉帳確認
export const doBookNtdTrConfirm = async (params) => (
  await userAxios.post('/api/transfer/ntdTr/book/confirm', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);

export const doModifyFacAcct = async (params) => (
  await userAxios.post('/api/transfer/modifyFacAcct', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);
// 約定帳號維護
export const doModifyRegAcct = async (params) => (
  await userAxios.post('/api/transfer/modifyRegAcct', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);
