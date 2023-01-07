import { callAPI } from 'utilities/axios';

/**
 * 取得快登綁定狀態及MID相關資訊。
 * @return {
 *   boundDate: 綁定日期，例: 20221231
 *   boundDevice: 綁定手機型號，例: iPhone 13
 *   midPhoneNo: MID認證可使用(或認證時)使用的門號。
 * }
 * @throws Exception
 */
export const getQuickLoginInfo = async () => {
  const response = await callAPI('/api/setting/v1/quickLoginBoundInfo', {});
  return response.data;
};
