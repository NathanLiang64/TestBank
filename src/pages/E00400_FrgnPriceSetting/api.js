import { callAPI } from 'utilities/axios';

/**
 * 查詢匯率行情
 * @returns {Promise<{
 * ccyname: string //  外幣幣別
 * ccyd: number // 外幣代碼
 * brate: number // 即時買進
 * srate: number // 即時賣出
 *  }>}
 */
export const getExchangeRateInfo = async () => {
  const response = await callAPI('/deposit/foreign/v1/getExRateInfo');
  return response.data;
};

/**
 * 查詢到價通知
 * @returns {Promise<{
 * currenty: string // 幣別
 * price: number // 價格
 * exchange_type: number // 換匯種類: 0.現金 1.即期
 * direction: number // 方向性 0:大於等於 1:小於等於
 * create_date: string  // 建立日期
 * today_count: number // 今日內通知次數
 *  }>}
 */

export const getAllNotices = async () => {
  const response = await callAPI('/deposit/foreign/v1/getAllNotices');
  return response.data;
};

/**
 * 建立到價通知設定
 * @param {{
 * currenty: string // 幣別
 * price: number // 價格
 * exchange_type: number // 換匯種類: 0.現金 1.即期
 * direction: number // 方向性 0:大於等於 1:小於等於
 * }} request
 * @returns {Promise<{ isSuccess, code, message }>} 更新成功與否的旗標。
 */

export const addNoticeItem = async (request) => {
  const response = await callAPI('/deposit/foreign/v1/addNoticeItem', {...request, exchange_type: 1});
  return response;
};

/**
 * 移除到價通知
 * @param {{
 * currenty: string // 幣別
 * price: number // 價格
 * exchange_type: number // 換匯種類: 0.現金 1.即期
 * direction: number // 方向性 0:大於等於 1:小於等於
 * }} request
 * @returns {Promise<{ isSuccess, code, message }>} 更新成功與否的旗標。
 */
export const removeNoticeItem = async (request) => {
  const response = await callAPI('/deposit/foreign/v1/removeNoticeItem', {...request, exchange_type: 1});
  return response;
};
