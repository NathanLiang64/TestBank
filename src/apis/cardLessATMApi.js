import userAxios from './axiosConfig';

// 檢查晶片卡狀態
export const getCardStatus = async () => {
  const response = await userAxios
    .get('/api/cardLessATM')
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 檢查無卡提款狀態
export const getStatusCode = async () => {
  const response = await userAxios
    .get('/api/cardLessATM')
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 取得提款卡資訊
export const getCardInfo = async () => {
  const response = await userAxios
    .get('/api/cardLessATM')
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 申請無卡提款
export const cardLessWithdrawApply = async (param) => {
  const response = await userAxios
    .post('/api/cardLessATM', param)
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 變更無卡提款密碼
export const changeCardlessPwd = async (param) => {
  const response = await userAxios
    .post('/api/cardLessATM', param)
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};
