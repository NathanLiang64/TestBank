import userAxios from './axiosConfig';

// 檢查晶片卡狀態
export const getCardStatus = async () => {
  const response = await userAxios
    .get('/api/getCardStatus')
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 檢查無卡提款狀態
export const getStatusCode = async () => {
  const response = await userAxios
    .get('/api/getStatusCode')
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 取得提款卡資訊
export const getAccountSummary = async () => {
  const response = await userAxios
    .get('/api/getAccountSummary')
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 申請無卡提款
export const cardLessWithdrawApply = async (param) => {
  const response = await userAxios
    .get('/api/cardLessWithdrawApply', param)
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 變更無卡提款密碼
export const changeCardlessPwd = async (param) => {
  const response = await userAxios
    .get('/api/changeCardlessPwd', param)
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 開通無卡提款與設定無卡提款密碼
export const cardLessWithdrawActivate = async (param) => {
  const response = await userAxios
    .get('/api/cardLessWithdrawActivate', param)
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 檢查UDID與快速登入
export const checkUDIDAndQuickLogin = async () => {
  const response = await userAxios
    .get('/api/checkUDIDAndQuickLogin')
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};
