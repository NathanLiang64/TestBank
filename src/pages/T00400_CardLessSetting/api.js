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
 * 開通/註銷 無卡提款服務
 * 注意:
 * 1. 需要先執行 /api/cardlessWD/getStatus 獲得卡況
 * TODO: 參數 newPassword 後續需處理加密問題
 * 2.  無卡提款狀態為 0, 3, 4，執行 [申請加開通] / 無卡提款狀態為 2，執行 [註銷]  / 無卡提款狀態為 1 ，執行 [開通]
 *
 * @param token
 * @param newPassword (註銷時放空白)
 * @return {
 *    message: 回傳訊息 空白表示成功 例如: 'E660: 申請不准'
 *    chgPwMessage:  空白表示密碼更新成功
 * }
 * @throws Exception
 */
export const activate = async (request) => {
  const response = await callAPI('/api/cardlessWD/activate', request);
  return response.data;
};
