import { callAPI } from 'utilities/axios';

/**
 * 查詢客戶信用卡自動扣繳資訊
 * (畫面_信用卡子首頁_自動扣繳 - 1)
 *
 * @param token
 * @return {
 *    bank      銀行別                                     IVR9019.DEDUCT-BANK
 *    account   扣繳帳號                                   IVR9019.DEDUCT-ACCOUNT-NO
 *    isFullPay 是否指定應繳總額 Y/N                        IVR9019.DEDUCT-AUTOPAY-RATE=100 ? "Y":"N"
 *    status    狀態 1 申請 2 生效 3 取消 4 退件 5 待生效   IVR9019.DEDUCT-STATUS
 * }
 *
 * TODO: 尚未有完整的測資，accountId 先固定帶 A123014281
 */
export const getAutoDebits = async (request) => {
  const response = await callAPI('/creditCard/v1/getAutoDebits', request);
  return response.data;
};

/**
 * 申請信用卡自動扣繳
 *
 * @param token
 * @param {
 *    bank:       指定銀行代碼
 *    account:    扣繳帳號
 *    isFullPay:  是否指定應繳總額 Y/N
 * }
 * @return {
 *    result:     true/false
 *    message:    回傳結果
 * }
 *
 */
export const setAutoDebit = async (request) => {
  const response = await callAPI('/creditCard/v1/setAutoDebit', request);
  return response.data;
};

/**
 * 取得帳號列表
 * @param {*} acctTypes 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @return [{
 *   account: 帳號,
 *   name: 帳戶名稱，若有暱稱則會優先用暱稱,
 *   transable: 已設約轉 或 同ID互轉(true/false)
 *   details: [{ // 外幣多幣別時有多筆
 *        balance: 帳戶餘額(非即時資訊), // TODO 依G0002的效能決定是否開放。
 *        currency: 幣別代碼,
 *   }, ...]
 * }, ...]
 */
export const getAccountsList = async () => {
  const response = await callAPI('/deposit/account/v1/getAccounts', 'M');
  // return response.data.map((acct) => ({ acctNo: acct.account }));
  return response.data;
};

/**
 * 查詢客戶的信用卡清單
 * (信用卡子首頁 - 1)
 * (信用卡子首頁_即時消費明細 - 1)
 *
 * @param token
 * @return {
 * usedCardLimit, // 已使用額度
 * memberLevel, // 會員等級
 * rewardsRateDomestic, // 國內回饋
 * rewardsRateOverseas, // 國外回饋
 * rewardsAmount, // 回饋試算
 * cards [
 *      {
 *        cardNo, // 卡號
 *        isBankeeCard, // 專案代號
 *      },
 *      ...
 *    ]
 * }
 *
 * TODO: 尚未有完整的測資，所以個電文先帶有測資的 id/帳號
 */
export const getCards = async (request) => {
  const response = await callAPI('/creditCard/v1/getCards', request);
  return response.data;
};
