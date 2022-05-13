import { callAPI } from 'utilities/axios';

/**
 * 通知設定綁定
 * @return {*}
 * {
 *  communityNotice: 是否啟用社群通知 : Y:啟用 , N:關閉
 *  boardNotice: 是否啟用公告通知 : Y:啟用 , N:關閉
 *  securityNotice: 是否啟用安全通知 : Y:啟用 , N:關閉
 *  nightMuteNotice: 是否啟用夜間靜音通知 : Y:啟用 , N:關閉
 * }
 */
export const bindPushSetting = async (param) => {
  const response = await callAPI('/api/push/v1/bindPushSetting', param);
  return response?.data;
};

/**
 * 查詢客戶綁定通知
 * @return {*}
 * {
 *  bindingUdid: 設備識別碼(有可能從jwtToken中取得)
 * }
 */
export const queryPushSetting = async () => {
  const response = await callAPI('/api/push/v1/queryPushSetting');
  return response?.data;
};
