// import { callAPI } from 'utilities/axios';

import {
  mockCreditCardDetails,
  mockBills,
  mockBillDetails,
  mockCreditCardTerms,
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
 * 取得信用卡交易明細
   TODO 目前先直接複製台幣交易明細，不知需否調整
   @param {
     accountNo: 帳號, ex: 00100100063106,
     custom: 文字檢索條件, ex: 退款.
     startDate: 交易日期起日, ex: 20200101,
     endDate: 交易日期迄日, ex: 20210731,
     txnType: 摘要代碼: 1:跨轉、2:ATM、3:存款息、4:薪轉、5:付款儲存、6:自動扣繳, 可多筆,
     month: 起始月份，預設為最接近月底的日期為起始索引, ex: 202104,
     startIndex: 指定起始索引,
     direct: 方向性.1:正向(新~舊)、2:反向(舊~新)、0:雙向方向性
   }
   @returns {
     "id": TODO 需要ID之類的識別碼
     "index": 1,
     "bizDate": "20220425",
     "txnDate": "20220425",
     "txnTime": 210156,
     "description": "全家便利商店",
     "memo": "備註最多7個字",
     "targetMbrId": null,
     "targetNickName": null,
     "targetBank": "000",
     "targetAcct": null,
     "amount": 36000,
     "balance": 386000,
     "cdType": "d",
     "currency": "TWD"
   }
 */
export const getTransactionDetails = async (request) => {
  // const response = await callAPI('/api/', request);
  const response = await new Promise((resolve) => resolve({ data: mockCreditCardDetails, request }));
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
 * 下載帳單
   TODO 不確定是否需要其他query條件，是否回傳檔案網址
   @param {
      "format": "pdf" 或 "excel"
   }
   @returns {
     "url": 檔案URL。
   }
 */
export const getInvoice = async (format) => {
  // const response = await callAPI('/api/');
  const response = await new Promise((resolve) => resolve({ data: { url: '/', format } }));
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
