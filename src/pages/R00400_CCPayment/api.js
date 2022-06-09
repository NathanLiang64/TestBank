// import { callAPI } from 'utilities/axios';

import {
  mockBills,
  mockBillDetails,
  mockCreditCardTerms,
  mockPaymentCodes,
} from './mockData';

/**
 * 取得信用卡繳費單
   @param {
     "accounts": 指定使否需提供可轉出的帳戶列表，預設 false。
   }
   @returns {
     "month": 本期月份
     "amount": 本期應繳金額
     "minAmount": 最低應繳金額
     "billDate": 繳費截止日
     "currency": 幣值
     "accounts": [ 可轉出的帳戶
       {
         "accountNo": 帳號
         "balance": 可用餘額
       }, ...],
   }
 */
export const getBills = async (accounts) => {
  // const response = await callAPI('/api/', accounts);
  const response = await new Promise((resolve) => resolve({ data: mockBills(accounts) }));
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
   }
 */
export const makePayment = async ({ amount, acctBranch, acctId }) => {
  // const response = await callAPI('/api/', { amount, acctBranch, acctId });
  const response = await new Promise((resolve) => resolve({
    data: { result: true }, amount, acctBranch, acctId,
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
