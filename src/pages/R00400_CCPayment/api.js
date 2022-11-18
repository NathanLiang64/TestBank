import { callAPI } from 'utilities/axios';
import mockBills from './mockData/mockBills';
import mockBillDetails from './mockData/mockBillDetails';
import mockCreditCardTerms from './mockData/mockCreditCardTerms';
import mockPaymentCodes from './mockData/mockPaymentCodes';

/**
 * 取得信用卡繳費單
   @param {
     "accountNo": 指定信用卡帳單，若未指定預設Bankee信用卡。
     "showAccounts": 指定使否需提供可轉出的帳戶列表，預設 false。
   }
   @returns {
     "month": 本期月份
     "amount": 本期應繳金額
     "minAmount": 最低應繳金額
     "billDate": 繳費截止日
     "accountNo": 信用卡卡號，用於交易查詢
     "currency": 幣值
     "autoDeduct": 是否已設定自動扣繳
     "accounts": [ 可轉出的帳戶
       {
         "accountNo": 帳號
         "balance": 可用餘額
       }, ...],
   }
 */
export const getBills = async (param) => {
  // const response = await callAPI('/api/', param);
  const response = await new Promise((resolve) => resolve({ data: mockBills(param) }));
  return response.data;
};

/**
 * 取得帳單資訊
   @returns {
     "amount": 本期應繳金額
     "minAmount": 最低應繳金額
     "invoiceDate": 帳單結帳日
     "billDate": 繳費截止日
     "prevAmount": 上期應繳金額
     "prevDeductedAmount": 已繳/退金額
     "newAmount": 本期新增款項
     "rate": 利息
     "fine": 違約金
     "credit": 循環信用額度
     "creditAvailable": 循環信用本金餘額
     "bindAccountNo": 自動扣款帳號
     "deductAmount": 繳款截止日扣款金額
   }
 */
export const getBillDetails = async () => {
  // Assume backend store Terms as escaped HTML...
  const response = await new Promise((resolve) => resolve({ data: mockBillDetails }));
  return response.data;
};

/**
 * 信繳用卡 轉帳費用
   @param {
      "amount": 金額
      "acctBranch": 分行
      "acctId": 帳號
   }
   @returns {
     "result": API執行結果。
     "autoDeduct": 是否已設定自動扣繳
   }
 */
export const makePayment = async ({ amount, acctBranch, acctId }) => {
  // const response = await callAPI('/api/', { amount, acctBranch, acctId });
  const response = await new Promise((resolve) => resolve({
    data: { result: true, autoDeduct: false }, amount, acctBranch, acctId,
  }));
  return response.data;
};

/**
 * 信繳用卡 超商費用
   TODO 不確定是否需要其他資訊，是否回傳圖片網址或base64
   @param {
      "amt": 交易金額
   }
   @returns {
     "type": "code39" 或 "qrcode"
     "image1": 條碼圖檔URL。
     "image2": 條碼圖檔URL，QR code 忽略。
     "image3": 條碼圖檔URL，QR code 忽略。
   }
 */
export const getPaymentCodes = async (amount) => {
  // const response = await callAPI('/api/', { amt: amount });
  const response = await new Promise((resolve) => resolve({ data: mockPaymentCodes(amount) }));
  return response.data;
};

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
 * TODO: 尚未有完整的測資，所以個電文先帶有測資的 id/帳號
 */
export const queryCardInfo = async (request) => {
  const response = await callAPI('/api/card/v1/getCardSummary', request);
  return response;
};
