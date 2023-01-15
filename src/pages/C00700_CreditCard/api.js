import { callAPI } from 'utilities/axios';
import { dateToYMD } from 'utilities/Generator';

import mockCreditCardTerms from './mockData/mockCreditCardTerms';

/**
 * 取得信用卡注意事項
 * @returns
 */
export const getCreditCardTerms = async () => {
  // Assume backend store Terms as escaped HTML...
  const response = await new Promise((resolve) => resolve({ data: decodeURI(mockCreditCardTerms) }));
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
  const response = await callAPI('/api/card/v1/getCards', request);
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
export const getTransactions = async (request) => {
  const response = await callAPI('/api/card/v1/getTransactions', request);
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
 * @return {
 *    result:   true/false
 *    message:  回傳結果
 * }
 *
 */
export const updateTxnNotes = async (param) => {
  const response = await callAPI('/api/card/v1/updateTxnNotes', param);
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
  const response = await callAPI('/api/card/v1/getCardSummary', request);
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
  const response = await callAPI('/api/card/v1/getRewards', request);
  return response;
};

/**
 * 查詢客戶信用卡帳單資訊
 *
 * @author danny
 * @Date 2022/09/27
 * @param token
 * @param period 期別 (ex: 202212)
 * }
 * @return {
 *    NewBalance,
 *    Details [
 *      {
 *        txDate,   交易日期時間 (yyyymmddhhmmss)
 *        cardNo,   卡號
 *        desc,     消費項目說明
 *        amount,   消費金額
 *      },
 *      ...
 *    ]
 * }
 */
export const queryCardBill = async (request) => {
  const response = await callAPI('/api/card/v1/getBillSummary', request);
  return response;
};

/**
 * 查詢會員自扣狀態，決定帳單提示內容與下方Button種類
 * 透過 queryCardInfo 查詢本期繳款截止日
 *
 * @param token
 * @return {
 *    autoDeductStatus:       0:尚未設定自扣，1:已設定自扣
 *    hintToPay:              繳費提醒
 * }
 * @throws ParseException
 *
 * TODO: 尚未有完整的測資，所以個電文先帶有測資的 id/帳號
 */
export const checkCardBillStatus = async (request) => {
  const response = await callAPI('/api/card/v1/getBillDeducStatus', request);
  return response;
};

/**
 * 信用卡帳單交易資訊
 * (信用卡子首頁_帳單_更多)
 *
 * @param token
 * @param period 期別 (ex: 202212)
 * }
 * @return {
 *    newBalance              本期應繳總額      ORDS.stmt_amt
 *    minDueAmount            最低應繳總額      ORDS.min_amt
 *    billClosingDate         帳單結帳日        ORDS.stmt_date
 *    payDueDate              繳款截止日        ORDS.pymt_due_date
 *    prevBalance             上期應繳金額      ORDS.pre_pymt_due_amt
 *    paidRefundAmount        已繳款/退款金額    ORDS.paid_amt
 *    newPurchaseAmount       本期新增款項      ORDS.new_stmt_amt
 *    interestFee             利息              ORDS.interest
 *    cardPenalty             違約金            ORDS.fine
 *    revCreditLimit          循環信用額度       ORDS.cycle_credit_limit
 *    revgCreditPrinBalance   循環信用本金餘額    ORDS.revolving_principal
 *    autoPayAccount          自動扣繳帳號       ORDS.autopay_account
 *    paidAmountOnDueDate     繳款截止日扣繳金額  ORDS.autopay_amt
 * }
 */
export const getBillDetail = async (request) => {
  const response = await callAPI('/api/card/v1/getBillDetail', request);
  return response;
};

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
  const response = await callAPI('/api/card/v1/getAutoDebits', request);
  return response;
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
  const response = await callAPI('/api/card/v1/setAutoDebit', request);
  return response;
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
