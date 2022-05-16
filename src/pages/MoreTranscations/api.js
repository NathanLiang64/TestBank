import { callAPI } from 'utilities/axios';

/**
 * 取得當前所選帳號之交易明細
 * @param {*} request {
    accountNo: 帳號, ex: 00100100063106,
    custom: 文字檢索條件, ex: 退款.
    startDate: 交易日期起日, ex: 20200101,
    endDate: 交易日期迄日, ex: 20210731,
    txnType: 摘要代碼: 1:跨轉、2:ATM、3:存款息、4:薪轉、5:付款儲存、6:自動扣繳, 可多筆,
    month: 起始月份，預設為最接近月底的日期為起始索引, ex: 202104,
    startIndex: 指定起始索引,
    direct: 方向性.1:正向(新~舊)、2:反向(舊~新)、0:雙向方向性
  }
 * @returns 帳戶往來明細清單
    {
        "index": 1,
        "bizDate": "20220425",
        "txnDate": "20220425",
        "txnTime": 210156,
        "description": "現金",
        "memo": null,
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
  const response = await callAPI('/api/deposit/v1/queryAcctTxDtl', request);
  return response.data;
};
