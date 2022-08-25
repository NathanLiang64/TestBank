import { callAPI } from 'utilities/axios';

// 01 新申請, 02 尚未開卡, 04 已啟用, 05 已掛失, 06 已註銷, 07 已銷戶, 08 臨時掛失中, 09 申請中

// 取得金融卡狀態
export const getDebitCardStatus = async (params) => {
  const response = await callAPI('/api/lossReissue/atmCard/detail', params);
  return response.data;
};

// 執行金融卡掛失
export const executeDebitCardReportLost = async (params) => {
  const response = await callAPI('/api/lossReissue/reportLost', params);
  return response.data;
};

// 執行金融卡補發
export const executeDebitCardReApply = async (params) => {
  const response = await callAPI('/api/lossReissue/reApply', params);
  return response.data;
};
