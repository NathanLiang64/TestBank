import { callAPI } from 'utilities/axios';

// 開通 APP - 開通行動銀行服務
export const openhb = async (param) => {
  const response = await callAPI('/client/openhb', param);
  return response.data;
};
