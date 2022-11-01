import { callAPI } from 'utilities/axios';

/**
 * 取得無卡提款狀態
 *
 * @param JwtToken
 * @return {
 *    cwdStatus:  無卡提款狀態   0-未申請 1-已申請未開通 2-已開通 3-已註銷 4-已失效 5-其他
 *    account:    台幣數存母帳號
 * }
 * @throws Exception
 */
export const getStatus = async (request) => {
  const response = await callAPI('/api/cardlessWD/getStatus', request);
  return response;
};

/**
 * 開通無卡提款服務
 * 注意
 * 1. 需要在 JwtToken 中的 payload 放入參數名稱為 clwdNewPassword 的新密碼
 * 2. 需要先執行 /api/cardlessWD/getStatus 獲得卡況
 *
 * @param JwtToken
 * @return {
 *      message:        回傳訊息 例如: 'E660: 申請不准'
 *      chgPwMessage:   空白表示成功
 * }
 * @throws Exception
 */
export const activate = async (request) => {
  const response = await callAPI('/api/cardlessWD/activate', request);
  return response.data;
};
