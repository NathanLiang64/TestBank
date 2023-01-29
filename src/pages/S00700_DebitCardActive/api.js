import { callAPI } from 'utilities/axios';

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
