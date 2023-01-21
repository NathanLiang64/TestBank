import { callAPI } from 'utilities/axios';

/**
 * 取得快登綁定狀態及MID相關資訊。
 * @returns {Promise<{
 *   status: Number,
 *   boundDate: String,
 *   boundDevice: String,
 *   boundType: Number,
 *   midMobile: String,
 * }>}
 * - status: 表示已綁定的旗標(0,未綁定 1,已正常綁定 2,綁定但已鎖定 3,已在其它裝置綁定 4,本裝置已綁定其他帳號)
 * - boundDate: 綁定日期，例: 20221231；若未綁定，則不會有此欄位
 * - boundDevice: 綁定手機型號，例: iPhone 13；若未綁定，則不會有此欄位
 * - boundType: 快登種類 (1.生物辨識, 2.圖形辨識)；若未綁定，則不會有此欄位
 * - midMobile: 若已綁定，則為 MID 認證時所使用的手機門號；反之，就是可用來進行MID認證的手機門號。
 */
export const getQuickLoginInfo = async () => {
  const response = await callAPI('/api/setting/v1/quickLoginBoundInfo');
  return response.data;
};
