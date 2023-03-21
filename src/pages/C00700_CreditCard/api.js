import { callAPI } from 'utilities/axios';
import { dateToYMD } from 'utilities/Generator';

/**
 * 查詢客戶的信用卡清單
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
export const getCards = async () => {
  const response = await callAPI('/creditCard/v1/getCards');
  return response.data;
};

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
  const dateBeg = '20210101'; // hard code for testing
  const dateEnd = dateToYMD();
  const payload = { cardNo, dateBeg, dateEnd };
  const response = await callAPI('/creditCard/v1/getTransactions', payload);
  return response.data;
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
 */
export const updateTxnNotes = async (param) => {
  const response = await callAPI('/creditCard/v1/updateTxnNotes', param);
  return response;
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
 * 查詢客戶信用卡每月現金回饋 (只顯示已結算月份，一次撈六個月份資料)
 * (信用卡子首頁_每月現金回饋)
 *
 * @author danny
 * @Date 2022/09/30
 * @param token
 * @return [
 *    {
 *        period // 期別
 *        amount // 刷卡回饋
 *        communityAmount // 社群圈回饋
 *    },
 *    ...
 * ]
 */
export const getRewards = async (request) => {
  const response = await callAPI('/creditCard/v1/getRewards', request);
  return response.data;
};
