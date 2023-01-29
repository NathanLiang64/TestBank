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
export const getTransactions = async (request) => {
  const response = await callAPI('/creditCard/v1/getTransactions', request);
  return response.data;
};

/**
 * 查詢客戶的 bankee 信用卡資訊
 *
 * @param token
 * @return {
 * usedCardLimit, // 已使用額度
 * isBankeeCard, // 專案代號
 * cards [
 *      {
 *        cardNo, // 卡號
 *      },
 *      ...
 *    ]
 * }
 *
 */

export const getBankeeCard = async (request) => {
  const {
    data: { cards, usedCardLimit },
  } = await callAPI('/creditCard/v1/getCards', request);
  const bankeeCard = cards.find((card) => card.isBankeeCard === 'Y');
  if (!bankeeCard) return null;
  return { cards: [{ cardNo: bankeeCard.cardNo }], usedCardLimit, isBankeeCard: true };
};

export const getTransactionPromise = (cardNo) => new Promise((resolve) => {
  const today = new Date();
  const dateBeg = dateToYMD(new Date(today.setMonth(today.getMonth() - 2))); // 查詢當天至60天前的資料
  const dateEnd = dateToYMD();
  const payload = { cardNo, dateBeg, dateEnd };
  getTransactions(payload).then((transactions) => {
    if (!transactions.length) resolve([]);
    else {
      // 將回傳的資料加入 cardNo 以利後續畫面渲染與編輯
      const newTransactions = transactions.map((transaction) => ({
        ...transaction,
        cardNo,
      }));
      resolve(newTransactions);
    }
  });
});

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
  return response.data;
};
