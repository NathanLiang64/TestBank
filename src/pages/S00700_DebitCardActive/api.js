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
