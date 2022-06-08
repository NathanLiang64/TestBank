// import { callAPI } from 'utilities/axios';

import {
  mockCreditCard,
  mockCreditCardDetails,
} from 'mockData';

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
