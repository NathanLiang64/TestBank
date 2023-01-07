import { callAPI } from 'utilities/axios';

/**
 * 取得使用者暱稱
 * @returns {Promise<{
 *   uuid: String, // 使用者識別碼，用來抓大頭貼用。下載後，存 localStorage
 *   nickname: String, // 䁥稱
 * }>}
 */
export const getNickname = async () => {
  /**
   * 取得社群圈摘要資訊
   * @returns {
   *   uuid: 使用者識別碼，用來抓大頭貼用。下載後，存 localStorage
   *   nickname: 䁥稱
   *   socailLevel: 社群等級
   *   memberNo: 個人專用推薦碼
   *   essay: 分享短文
   *   community: { 社群圈概況
   *     hitTimes: 點擊人數
   *     applying: 申請中人數
   *     approved: 已核可人數
   *   }
   *   bonusInfo: { 社群圈回饋
   *     amount: 優惠存款額度
   *     profit: 信用卡分潤
   *   }
   * }
   */
  const response = await callAPI('/api/community/v1/getSummary');
  return {
    uuid: response.data.uuid,
    nickname: response.data.nickname,
  };
};

/**
 * 更新䁥稱
 */
export const updateNickname = async (nickname) => {
  const response = await callAPI('/api/community/v1/updateNickname', nickname);
  return response.data;
};

/**
 * 更新大頭貼
 * @param {String} newImg 新的大頭貼影像，內容為 Base64 字串。
 * @returns
 */
export const uploadAvatar = async (newImg) => {
  const response = await callAPI('/api/community/v1/uploadAvatar', newImg);
  return response.data;
};
