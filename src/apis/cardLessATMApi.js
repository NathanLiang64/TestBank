import userAxios from './axiosConfig';

// 檢查金融卡卡狀態
export const getCardStatus = async (param) => {
  const response = await userAxios
    .post('/api/atmCard/getStatus', param)
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 檢查無卡提款狀態
export const getCardlessStatus = async () => {
  const response = await userAxios
    .get('/api/cardlessWD/getStatus')
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 取得提款卡資訊
export const getAccountSummary = async () => {
  const response = await userAxios
    .get('/api/deposit/getAccountSummary')
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 申請無卡提款
export const cardLessWithdrawApply = async (param) => {
  const response = await userAxios
    .get('/api/cardlessWD/withdrawal', param)
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 變更無卡提款密碼
export const changeCardlessPwd = async (param) => {
  const response = await userAxios
    .get('/api/cardlessWD/changePwd', param)
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

// 開通無卡提款與設定無卡提款密碼
export const cardLessWithdrawActivate = async (param) => {
  const response = await userAxios
    .get('/api/cardlessWD/activate', param)
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};
