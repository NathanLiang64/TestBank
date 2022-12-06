import { callAPI } from 'utilities/axios';

/**
 * 檢查無卡提款狀態
 * @returns {Promisr<String>} 無卡提款狀態。 0-未申請 1-已申請未開通 2-已開通 3-已註銷 4-已失效 5-其他
 */
export const getCardlessWdStatus = async () => {
  const response = await callAPI('/api/cardlessWD/getStatus');
  return response.data;
};

/**
 * 取得取得免費跨提/跨轉次數、數存優惠利率及資訊
 * @param {String} accountNo 存款帳號
 * @returns {Promise<{
    freeWithdraw: 免費跨提總次數
    freeWithdrawRemain: 免費跨提剩餘次數
    freeTransfer: 免費跨轉總次數
    freeTransferRemain: 免費跨轉剩餘次數
    bonusQuota: 優惠利率額度
    bonusRate: 優惠利率
    interest: 累積利息
  }>} 優惠資訊
 */
export const getAccountExtraInfo = async (accountNo) => {
  const response = await callAPI('/api/depositPlus/v1/getBonusInfo', accountNo);
  return response.data;
};

// 申請無卡提款 done
export const cardLessWithdrawApply = async (param) => {
  const response = await callAPI('/api/cardlessWD/withdrawal', param);
  return response.data;
};

/**
 * 開通無卡提款服務 測試時須請ken幫忙協助reset無卡提款狀態
 *
 * @param token
 * @return {
 *    message: 回傳訊息 例如: 'E660: 申請不准'
 *    chgPwMessage: 空白表示成功
 * }
 * @throws Exception
 */
export const cardLessWithdrawActivate = async (param) => {
  const response = await callAPI('/api/cardlessWD/activate', param);
  return response.data;
};
