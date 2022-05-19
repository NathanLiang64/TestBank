import { callAPI } from 'utilities/axios';

/**
 * 通知設定綁定
 * @param {*} request {
 *  communityNotice: 是否啟用社群通知 : Y:啟用 , N:關閉
 *  boardNotice: 是否啟用公告通知 : Y:啟用 , N:關閉
 *  securityNotice: 是否啟用安全通知 : Y:啟用 , N:關閉
 *  nightMuteNotice: 是否啟用夜間靜音通知 : Y:啟用 , N:關閉
 * }
 * @returns
 */
export const bindPushSetting = async (request) => {
  const response = await callAPI('/api/push/v1/bindPushSetting', request);
  return response.data;
};

/**
 * 查詢客戶近兩個月推播訊息
 * @returns [{
 *  msgId: 訊息編號
 *  msgType: 訊息類別, P:公告 A:帳務 C:社群 S:安全
 *  msgOutline: 訊息標題, Base64編碼
 *  msgContent: 訊息簡述, Base64編碼
 *  msgUrl: 優惠導連, 無導連時則空
 *  sendTime: 發送時間
 *  status: 狀態, R:已讀 其他:未讀
 * }, ...]
 */
export const queryPushSetting = async () => {
  const response = await callAPI('/api/push/v1/queryPushSetting');
  return response.data;
};

/**
 * 查詢客戶近兩個月推播訊息
 * @returns [{
 *  msgId: 訊息編號
 *  msgType: 訊息類別, P:公告 A:帳務 C:社群 S:安全
 *  msgOutline: 訊息標題, Base64編碼
 *  msgContent: 訊息簡述, Base64編碼
 *  msgUrl: 優惠導連, 無導連時則空
 *  sendTime: 發送時間
 *  status: 狀態, R:已讀 其他:未讀
 * }, ...]
 */
export const queryLastPush = async () => {
  const response = await callAPI('/api/push/v1/queryLastPush');
  return response.data;
};

/**
 * 推播訊息單筆已讀
 * @returns
 */
export const chgPushStatus = async () => {
  const response = await callAPI('/api/push/v1/chgPushStatus');
  return response.data;
};

/**
* 推播訊息單筆刪除
 * @param {*} request { msgId }
 * @returns
 */
export const deletePush = async () => {
  const response = await callAPI('/api/push/v1/deletePush');
  return response.data;
};

/**
 * 推播訊息全部已讀
 * @param request { msgType }
 * @returns
 */
export const chgAllPushStatus = async () => {
  const response = await callAPI('/api/push/v1/chgAllPushStatus');
  return response.data;
};

/**
 * 推播訊息全部刪除
 * @param request { msgType }
 * @returns
 */
export const deleteAllPush = async () => {
  const response = await callAPI('/api/push/v1/deleteAllPush');
  return response.data;
};
