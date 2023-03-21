import { callAPI } from 'utilities/axios';
import { dateToYMD } from 'utilities/Generator';

/**
 * 查詢即時消費明細
 * (信用卡子首頁 - 2)
 * (信用卡子首頁_即時消費明細 - 2)
 *
 * @param token
 * @param rq {
 *    cardNo,   卡號
 *    dateBeg,  查詢起日 (西元YYYYMMDD)
 *    dateEnd,  查詢迄日 (西元YYYYMMDD)
 * }
 * @return [
 *    {
 *      txDate, 交易日期時間 (yyyymmddhhmmss)
 *      amount, 消費金額
 *      txName,
 *      txKey,  交易鍵值
 *      note,   備註
 *    },
 *    ...
 * ]
 */
export const getTransactions = async (cardNo) => {
  // const today = new Date();
  // const dateBeg = dateToYMD(new Date(today.setMonth(today.getMonth() - 2))); // 查詢當天至60天前的資料
  // NOTE ************** 測試需求，hardcode 起始日 **************
  const dateBeg = '20210101';
  const dateEnd = dateToYMD();
  const payload = { cardNo, dateBeg, dateEnd };
  const response = await callAPI('/creditCard/v1/getTransactions', payload);
  return response.data;
};

/**
 * 查詢客戶的 bankee 信用卡資訊
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

export const getBankeeCard = async (request) => {
  const { data: { cards, usedCardLimit } } = await callAPI('/creditCard/v1/getCards', request);
  const bankeeCard = cards.find((card) => card.isBankeeCard);
  return {...bankeeCard, usedCardLimit};
};

/**
 * 編輯信用卡即時消費明細備註
 * (信用卡子首頁 - 3)
 * (信用卡子首頁_即時消費明細 - 3)
 *
 * @param token
 * @param {
 *    cardNo:   卡號
 *    txDate:   消費日期
 *    txKey:    消費明細唯一Key值
 *    note:     備註內容
 * }
 * @return {
 *    result:   true/false
 *    message:  回傳結果
 * }
 *
 */
export const updateTxnNotes = async (param) => {
  const response = await callAPI('/creditCard/v1/updateTxnNotes', param);
  return response;
};
