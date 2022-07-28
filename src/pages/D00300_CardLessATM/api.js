import { callAPI } from 'utilities/axios';

// 檢查金融卡卡狀態 done
export const getCardStatus = async (param) => {
  const response = await callAPI('/api/cardlessWD/atmCard/getStatus', param);
  return response.data;
};

// 檢查無卡提款狀態 done
export const getCardlessStatus = async (param) => {
  const response = await callAPI('/api/cardlessWD/getStatus', param);
  return response.data;
};

// 取得提款卡資訊 done
export const getAccountSummary = async (param) => {
  const response = await callAPI('/api/cardlessWD/deposit/getAccountSummary', param);
  return response.data;
};

// 申請無卡提款 done
export const cardLessWithdrawApply = async (param) => {
  const response = await callAPI('/api/cardlessWD/withdrawal', param);
  return response.data;
};

// 開通無卡提款與設定無卡提款密碼 done
export const cardLessWithdrawActivate = async (param) => {
  const response = await callAPI('/api/cardlessWD/activate', param);
  return response.data;
};
