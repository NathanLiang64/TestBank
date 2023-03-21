import { callAPI } from 'utilities/axios';

/**
 * 取得超商繳費Barcode資料
 *
 * @param token
 * @param {
 *    amount: 預計繳費金額
 * }
 * @return {
 *    barcode1: Barcode 條碼 1
 *    barcode2: Barcode 條碼 2
 *    barcode3: Barcode 條碼 3
 * }
 * @throws Exception
 *
 */
export const queryPayBarcode = async (request) => {
  const response = await callAPI('/creditCard/v1/queryPayBarcode', request);
  return response.data;
};

/**
 * 查詢客戶信用卡帳單資訊
 * (信用卡子首頁_信用卡資訊)
 *
 * @param token
 * @param cardNo bankee 卡號 或 空白表示不指定
 * @return {
 *    cardLimit:                   信用卡額度
 *    usedCardLimit:               已使用額度計算
 *    availCardLimit:              可使用額度
 *    cashAdvAvailLimitDomestic:   國內預借現金可用額度
 *    cashAdvAvailLimitOverseas:   國外預借現金可用額度
 *    billClosingDate:             帳單結帳日
 *    payDueDate:                  本期繳款截止日
 *    minDueAmount:                最低應繳金額
 *    newBalance:                  本期應繳總額
 *    lastPayDate:                 最近繳款日期
 *    paidAmount:                  本期累積已繳金額
 * }
 *
 */
export const queryCardInfo = async (request) => {
  const response = await callAPI('/creditCard/v1/getCardSummary', request);
  return response.data;
};

/**
 * 信用卡繳費(自行帳戶繳卡費)
 *
 * @param token
 * @param {{
 *    amount:number //  金額
 *    account: string // 轉出帳號
 *    cardNo: string // Bankee 信用卡卡號 (後端API用來繳費歸戶用)
 * }} request
 *
 * @return {Promise<{
 * payResult: Boolean, //付款結果
 * autoDeductStatus: number, //繳款狀態 0:尚未設定自扣，1:已設定自扣
 * }>}
 */
export const payCardFee = async (request) => {
  const response = await callAPI('/creditCard/v1/payCardFee', request);
  return response;
};

/**
 * 查詢客戶的 Bankee 信用卡
 * @returns {Promise<{
 *   usedCardLimit: Number, // 已使用額度
*   cards: [{
*     cardNo: String, // 卡號
*     isBankeeCard: Boolean, // Bankee信用卡旗標
*     memberLevel: Number, // 會員等級 (Bankee信用卡才有值)
*     rewardsRateDomestic: Number, // 國內消費 刷卡金回饋比例 (Bankee信用卡才有值)
*     rewardsRateOverseas: Number, // 國外消費 刷卡金回饋比例 (Bankee信用卡才有值)
*     rewardsAmount: Number, // 回饋試算 (Bankee信用卡才有值)
*   }]
* }>}
 */

export const getBankeeCardNo = async (request) => {
  const { data: { cards } } = await callAPI('/creditCard/v1/getCards', request);
  const bankeeCard = cards.find((card) => !!card.isBankeeCard);
  return bankeeCard.cardNo;
};
