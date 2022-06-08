// import { callAPI } from 'utilities/axios';

import {
  mockCreditCard,
  mockCreditCardDetails,
  mockRewards,
  mockCreditCardTerms,
} from './mockData';

/**
 * 取得信用卡資訊與交易明細
   @returns [
   {
     "type": "bankee" 或 "all"
     "accountNo": 卡號
     "expenditure": 已使用額度
     "autoDeduct": 是否已設定自動扣繳 (所有信用卡忽略)
     "bonusInfo": {  (所有信用卡忽略)
       "level": 會員等級
       "rewardLocalRate": 國內回饋百分比(不含%符號)
       "rewardForeignRate": 國外回饋百分比(不含%符號)
       "rewards": 回饋試算
     },
     "transactions": [
       {
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
         "cdType": "cc",
         "currency": "TWD"
       }, ...],
    }, ...]
 */
export const getCreditCards = async () => {
  // const response = await callAPI('/api/');
  const response = await new Promise((resolve) => resolve({ data: mockCreditCard }));
  return response.data;
};

/**
 * 取得信用卡資訊
   @param {
     "accountNo": 卡號
   }
   @returns {
     "invoiceDate": 帳單結帳日
     "billDate": 繳費截止日
     "amount": 本期應繳金額
     "minAmount": 最低應繳金額
     "accumulatedPaid": 本期累積已繳金額
     "recentPayDate": 最近繳費日
     "credit": 信用卡額度
     "creditUsed": 已使用額度
     "creditAvailable": 可使用額度
     "localCashCredit": 國內預借現金可使用額度
     "foreignCashCredit": 國外預借現金可使用額度
   }
 */
export const getCreditCardDetails = async (accountNo) => {
  // const response = await callAPI('/api/', accountNo);
  const response = await new Promise((resolve) => resolve({ data: mockCreditCardDetails(accountNo) }));
  return response.data;
};

/**
 * 變更交易備註
   @param {
       "id": TODO 交易識別碼
     "memo": 交易備註（最多7個字元）
   }
   @returns {
     "result": API執行結果。
   }
 */
export const updateMemo = async (id, memo) => {
  // const response = await callAPI('/api/', { id, memo });
  const response = await new Promise((resolve) => resolve({ data: { result: true, id, memo } }));
  return response.data;
};

/**
 * 取得信用卡現金回饋
   TODO 確定要一個月的抓，還是一次就六個月？
   @param {
     "month": 指定月份，留空為六個月。
   }
   @returns [
     {
       "month": 本期月份
       "card": 刷卡回饋
       "social": 社群圈分潤
       "point": 金讚點數兌換回饋
     }, ...]
 */
export const getRewards = async (month) => {
  // const response = await callAPI('/api/', month);
  const response = await new Promise((resolve) => resolve({ data: mockRewards(month) }));
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
