import { callAPI } from 'utilities/axios';
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
  const response = await callAPI('/api/card/v1/queryPayBarcode', request);
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
  return response;
};

/**
 * 信用卡繳費(自行帳戶繳卡費)
 *
 * @param token
 * @param {
 *    amount:  金額
 *    account: 轉出帳號
 *    cardNo:  Bankee 信用卡卡號 (後端API用來繳費歸戶用)
 * }
 * @return {
 *    code:     0000 表示成功
 *    message:  Success!!
 * }
 */
export const payCardFee = async (request) => {
  const response = await callAPI('/api/card/v1/payCardFee', request);
  return response.data;
};
