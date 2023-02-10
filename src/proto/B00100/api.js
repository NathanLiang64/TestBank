import { callAPI } from 'utilities/axios';
import { timeToString } from 'utilities/Generator';

export const mobileAccountUnbind = async (request) => {
  const response = await callAPI('/api/mobileAccount/v1/unbind', request);
  return response.data;
};

export const assetSummary = async () => {
  const t1 = new Date();
  console.log(`${timeToString(t1)}.${t1.getMilliseconds()}`);

  // const response = await callAPI('/smApi/v1/getHomeData');
  const response = await callAPI('/personal/v1/assetSummary');

  const t2 = new Date();
  console.log(`${timeToString(t2)}.${t2.getMilliseconds()}`);
  return response;
};

export const getAssetSummaryValues = async () => {
  const response = await callAPI('/personal/v1/assetSummaryValues');
  return response;
};

/**
 * register Push Token
 * @param {*} request { pushToken }
 * @returns
 */
export const registerToken = async (request) => {
  const response = await callAPI('/smApi/v1/push/registerToken', request);
  return response;
};
