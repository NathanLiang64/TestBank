import { callAPI } from 'utilities/axios';

// 取得近兩個月推播訊息
export const queryLastPush = async () => {
  const response = await callAPI('/api/push/v1/queryLastPush', {});
  return response?.data;
};
