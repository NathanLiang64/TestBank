import { callAPI } from 'utilities/axios';
// import mockData from './mockData';

/**
 * 取得接受推薦的好友名單
 * @returns [{
 *   friendUuid: 好友大頭貼
 *   friendName: 好友姓名
 *   creditCardApproved: 核卡完成日期
 *   depositApproved: Bankee台幣開戶完成日期
 * }, ...]
 */
export const getFriends = async () => {
  const response = await callAPI('/api/community/v1/getFriends');
  // const response = await new Promise((resolve) => resolve({ data: mockData }));
  return response.data;
};
