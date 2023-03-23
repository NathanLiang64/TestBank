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
  const {isSuccess, data} = await callAPI('/client/v1/bindPushSetting', request);
  return {
    isSuccess,
    setting: {
      communityNotice: data.communityNotice === 'Y',
      boardNotice: data.boardNotice === 'Y',
      securityNotice: data.securityNotice === 'Y',
      nightMuteNotice: data.nightMuteNotice === 'Y',
    },
  };
};

/**
 * 查詢客戶綁定通知
 * @returns {
 *  communityNotice: 是否啟用社群通知 : Y:啟用 , N:關閉
 *  boardNotice: 是否啟用公告通知 : Y:啟用 , N:關閉
 *  securityNotice: 是否啟用安全通知 : Y:啟用 , N:關閉
 *  nightMuteNotice: 是否啟用夜間靜音通知 : Y:啟用 , N:關閉
 * }
 */
export const queryPushSetting = async () => {
  const {data} = await callAPI('/client/v1/queryPushSetting');

  return {
    communityNotice: data.communityNotice === 'Y',
    boardNotice: data.boardNotice === 'Y',
    securityNotice: data.securityNotice === 'Y',
    nightMuteNotice: data.nightMuteNotice === 'Y',
  };
};
