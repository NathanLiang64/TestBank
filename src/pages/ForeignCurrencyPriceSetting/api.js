import { callAPI } from 'utilities/axios';

/**
 * 取得所有到價通知設定
 * @return {*} 到價通知設定陣列。
 * [{
 *  currency: 幣別, 例："JPY"; 可以透過 Generator.js 的 getCurrenyInfo() 取得。
 *  price: 價格, 例：4.5
 *  exchange_type: 換匯種類: 0.現金 1.即期
 * }]
 */
export const getAllNotices = async () => {
  const response = await callAPI('/deposit/foreign/v1/getAllNotices');
  return response.data;
};

/**
 * 建立到價通知設定
 * @param {*} notice {
 *  currency: 幣別, 例："JPY"; 可以透過 Generator.js 的 getCurrenyInfo() 取得。
 *  price: 價格, 例：4.5
 *  exchange_type: 換匯種類: 0.現金 1.即期
 * }
 */
export const addNotice = async (notice) => {
  const response = await callAPI('/deposit/foreign/v1/addNoticeItem', notice);
  return response.data;
};

/**
 * 刪除到價通知設定，必需提供完全相同的資料才能刪除。
 * @param {*} notice {
 *  currency: 幣別, 例："JPY"; 可以透過 Generator.js 的 getCurrenyInfo() 取得。
 *  price: 價格, 例：4.5
 *  exchange_type: 換匯種類: 0.現金 1.即期
 * }
 */
export const removeNotice = async (notice) => {
  const response = await callAPI('/deposit/foreign/v1/removeNoticeItem', notice);
  return response.data;
};

/**
 * 修改到價通知設定。
 * @param {*} oldNotice 修改前的通知內容。
 * @param {*} newNotice 修改後的通知內容。
 */
export const updateNotice = async (oldNotice, newNotice) => {
  await removeNotice(oldNotice);
  return await addNotice(newNotice);
};

// 取得可交易幣別
export const getCcyList = async (param) => {
  const response = await callAPI('/deposit/foreign/qserviceTrfiCcy', param);
  return response.data;
};
