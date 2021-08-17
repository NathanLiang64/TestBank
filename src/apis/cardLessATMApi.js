import userAxios from './axiosConfig';

// 檢查金融卡卡狀態 done
export const getCardStatus = async (param) => {
  const response = await userAxios
    .post('/api/atmCard/getStatus', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 檢查無卡提款狀態 done
export const getCardlessStatus = async (param) => {
  const response = await userAxios
    .post('/api/cardlessWD/getStatus', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 取得提款卡資訊 done
export const getAccountSummary = async (param) => {
  const response = await userAxios
    .post('/api/deposit/getAccountSummary', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 申請無卡提款 done
export const cardLessWithdrawApply = async (param) => {
  const response = await userAxios
    .post('/api/cardlessWD/withdrawal', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 變更無卡提款密碼 done
export const changeCardlessPwd = async (param) => {
  const response = await userAxios
    .post('/api/cardlessWD/changePwd', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 開通無卡提款與設定無卡提款密碼 done
export const cardLessWithdrawActivate = async (param) => {
  const response = await userAxios
    .post('/api/cardlessWD/activate', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
