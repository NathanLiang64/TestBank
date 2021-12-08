import { userRequest } from './axiosConfig';

// export const doGetInitData = (apiUrl) => (
//   userAxios.get(apiUrl)
//     .then((response) => response.data)
//     .catch((error) => error.response)
// );

// 01 新申請, 02 尚未開卡, 04 已啟用, 05 已掛失, 06 已註銷, 07 已銷戶, 08 臨時掛失中, 09 申請中

// 取得金融卡狀態
export const getDebitCardStatus = (params) => (
  userRequest('post', '/api/lossReissue/atmCard/detail', params)
);

// 執行金融卡掛失
export const executeDebitCardReportLost = (params) => (
  userRequest('post', '/api/lossReissue/reportLost', params)
);

// 執行金融卡補發
export const executeDebitCardReApply = (params) => (
  userRequest('post', '/api/lossReissue/reApply', params)
);
