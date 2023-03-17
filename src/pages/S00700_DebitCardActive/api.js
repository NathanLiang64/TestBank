import { callAPI } from 'utilities/axios';

/**
 * 查詢金融卡的卡況
 * @param token
 * @return {Promise<{
 *    status: number //       卡片狀態 1.新申請, 2.製卡 , 4.啟用, 5.掛失, 6.註銷, 7.銷戶, 8.臨時掛失, 9.整批申請
 *    statusDesc: string//  狀態描述 (1, 9) '申請中', (2) '尚未開卡', (4) '已啟用', (5) '已掛失', (6) '已註銷', (7) '已銷戶', (8) '已暫掛'
 *    account:  string //    臺幣數存母帳號
 * }>}
 * @throws Exception
 *
 */

export const getStatus = async (params) => {
  const response = await callAPI('/deposit/withdraw/card/v1/getStatus', params);
  return response.data;
};

/**
 * 金融卡啟用服務
 * 注意:
 * 1. 需要先執行 /deposit/withdraw/card/v1/getStatus 獲得卡況
 *
 * @param {{
 *   serial: 卡片序號
 * }} request
 * @returns {Promise<{
 *   data: Boolean, // 啟用結果
 *   message: 電文訊息
 *   isSuccess
 * }>}
 */

export const activate = async (request) => {
  const response = await callAPI('/deposit/withdraw/card/v1/activate', request);
  return response;
};
