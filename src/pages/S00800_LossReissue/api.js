import { callAPI } from 'utilities/axios';

// 01 新申請, 02 尚未開卡, 04 已啟用, 05 已掛失, 06 已註銷, 07 已銷戶, 08 臨時掛失中, 09 申請中

// 取得金融卡狀態 (舊)
// export const getDebitCardStatus = async (params) => {
//   const response = await callAPI('/api/lossReissue/atmCard/detail', params);
//   return response.data;
// };

// 執行金融卡掛失 (舊)
export const executeDebitCardReportLost = async (params) => {
  const response = await callAPI('/api/lossReissue/reportLost', params);
  return response.data;
};

// 執行金融卡補發
export const executeDebitCardReApply = async (params) => {
  const response = await callAPI('/api/lossReissue/reApply', params);
  return response.data;
};

/**
 * 查詢金融卡的卡況
 *
 * @param token
 * @return {
 *    status:       卡片狀態 1.新申請, 2.製卡 , 4.啟用, 5.掛失, 6.註銷, 7.銷戶, 8.臨時掛失, 9.整批申請
 *    statusDesc:   狀態描述 (1, 9) '申請中', (2) '尚未開卡', (4) '已啟用', (5) '已掛失', (6) '已註銷', (7) '已銷戶', (8) '已暫掛'
 *    addrCity:     通訊地址(縣市)    g0101.ADR2-CT
 *    addrDistrict: 通訊地址(區)      g0101.ADR2-AR
 *    addrStreet:   通訊地址(街道路)   g0101.ADR2-RD
 * }
 * @throws Exception
 *
 */
export const getStatus = async (params) => {
  const response = await callAPI('/api/debit/card/v1/getStatus', params);
  return response;
};

/**
 * 金融卡掛失
 * 條件: 卡況 需要 2製卡 4已啟用 8臨時掛失中 這三種時，才可以掛失
 *
 * @param token
 * @return {
 *      result:   true/false
 *      message:  訊息
 * }
 */
export const reIssue = async (params) => {
  const response = await callAPI('/api/debit/card/v1/reIssue', params);
  return response;
};
