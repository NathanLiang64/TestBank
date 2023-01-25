import { callAPI } from 'utilities/axios';
import { showCustomPrompt } from 'utilities/MessageModal';

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
export const getBillSummary = async (request) => {
  const response = await callAPI('/api/card/v1/getBillSummary', request);
  return response.data;
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
  return response.data;
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
export const getBillDeducStatus = async (request) => {
  const response = await callAPI('/api/card/v1/getBillDeducStatus', request);
  return response.data;
};

/**
 * 下載帳單
   TODO 不確定是否需要其他query條件，是否回傳檔案網址
   @param {
      "fileType": 1 = pdf 或 2 = excel
   }
   @returns {
     "url": 檔案URL。
   }
 */
export const getInvoice = async (format) => {
  // TODO 下載帳單

  await showCustomPrompt({
    title: '待串接API',
    message: `${format === 1 ? '下載PDF' : '下載EXCEL'}`,
    noDismiss: true,
  });
};
