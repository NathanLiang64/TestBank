import { callAPI } from 'utilities/axios';
// import mockData from './mockData';

/**
 * 取得接受推薦的好友名單
 * @returns [{
 *   friendUuid: 好友大頭貼
 *   friendName: 好友姓名
 *   creditCardApproved: 核卡完成日期
 *   depositApproved: Bankee臺幣開戶完成日期
 * }, ...]
 */
export const getFriends = async () => {
  const response = await callAPI('/community/v1/getFriends');
  return response.data;
};
