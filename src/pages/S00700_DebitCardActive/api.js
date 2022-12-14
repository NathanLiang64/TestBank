import { callAPI } from 'utilities/axios';

/**
 * 金融卡啟用服務
 * 注意:
 * 1. 需要先執行 /api/debit/card/v1/getStatus 獲得卡況
 *
 * @param {*} request {
 *      actno: BANKEE帳號
 *      serial: 卡片序號
 * }
 * @returns {
 *      message: 電文訊息
 *      code: 電文結果狀態碼, 0000-成功
 *      cname: 戶名
 * }
 */

export const activate = async (request) => {
  const response = await callAPI('/api/debit/card/v1/activate', request);
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
*    account:      台幣數存母帳號
* }
* @throws Exception
*
*/
export const getStatus = async (params) => {
  const response = await callAPI('/api/debit/card/v1/getStatus', params);
  return response.data;
};
