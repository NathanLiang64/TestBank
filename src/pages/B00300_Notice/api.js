import { callAPI } from 'utilities/axios';

/**
 * 查詢客戶近兩個月推播訊息
 * @param token
 * @param request { }
 * @return[{
  msgId: 訊息編號
  msgType: 訊息類別, P:公告 A:帳務 C:社群 S:安全
  msgOutline: 訊息標題, Base64編碼
  msgContent: 訊息簡述, Base64編碼
  msgUrl: 優惠導連, 無導連時則空
  sendTime: 發送時間
  status: 狀態, R:已讀 其他:未讀
}, ...]
*/
export const queryLastPush = async () => {
  const response = await callAPI('/api/push/v1/queryLastPush');
  return response.data;
};

/**
   * 推播訊息單筆已讀
 * @param token
 * @param request { msgId }
 * @return
 */
export const chgPushStatus = async () => {
  const response = await callAPI('/api/push/v1/chgPushStatus');
  return response.data;
};

/**
   * 推播訊息單筆刪除
 * @param token
 * @param request { msgId }
 * @return
 */
export const deletePush = async () => {
  const response = await callAPI('/api/push/v1/deletePush');
  return response.data;
};

/**
 * 推播訊息全部已讀
 * @param token
 * @param request { msgType }
 * @return
 */
export const chgAllPushStatus = async () => {
  const response = await callAPI('/api/push/v1/chgAllPushStatus');
  return response.data;
};

/**
 * 推播訊息全部刪除
 * @param token
 * @param request { msgType }
 * @return
 */
export const deleteAllPush = async () => {
  const response = await callAPI('/api/push/v1/deleteAllPush');
  return response.data;
};
