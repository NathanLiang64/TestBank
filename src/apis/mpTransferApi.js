import userAxios from './axiosConfig';

// 查詢可綁定手機及狀態
export const getMobile = async (param) => {
  const response = await userAxios
    .post('/api/mpt/queryMobile', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 取得已綁定帳號
export const getUserActNo = async (param) => {
  const response = await userAxios
    .post('/api/mpt/userActNo', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 手機號碼收款設定新增
export const createMobileNo = async (param) => {
  const response = await userAxios
    .post('/api/mpt/userCreate', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 手機號碼收款設定更新
export const editMobileNo = async (param) => {
  const response = await userAxios
    .post('/api/mpt/userChgAcct', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 手機號碼收款設定取消客戶綁定
export const unbindMobileNo = async (param) => {
  const response = await userAxios
    .post('/api/mpt/userUnbind', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
