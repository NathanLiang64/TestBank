// import { callAPI } from 'utilities/axios';

import mockBasicCreditCard from './mockData/mockBasicCreditCard';
import mockTransactions from './mockData/mockTransactions';

/**
 * 取得簡單信用卡資訊
   @param {
     accountNo: 帳號, ex: 00100100063106,
   }
   @returns [
   {
     "type": "bankee" 或 "all"
     "accountNo": 卡號
     "creditUsed": 已使用額度
    }, ...]
 */
export const getBasicCCInfo = async (param) => {
  // const response = await callAPI('/api/', param);
  const response = await new Promise((resolve) => resolve({ data: mockBasicCreditCard(param) }));
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
     "targetAcct": TODO 或許這個是卡號
     "amount": 36000,
     "balance": 386000,
     "cdType": "d",
     "currency": "TWD"
   }
 */
export const getTransactions = async (request) => {
  // const response = await callAPI('/api/', request);
  const response = await new Promise((resolve) => resolve({ data: mockTransactions(request) }));
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
