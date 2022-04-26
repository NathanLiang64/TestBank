import { callAPI } from 'utilities/axios';

// 取得所有台幣帳號
export const getAccountSummary = async (request) => {
  // if (request) {
  //   return [{
  //     acctBranch: '信義分行',
  //     acctName: '保時捷車友會',
  //     acctId: '04300498017356', // B100000002
  //     acctType: '004',
  //     acctBalx: 2000000,
  //     ccyCd: 'TWD',
  //   }];
  // }

  const response = await callAPI('/api/deposit/v1/accountSummary', request);
  return response.data.map((acct) => ({
    acctBranch: acct.branchName,
    acctName: acct.name,
    acctId: acct.no,
    acctType: acct.type,
    acctBalx: acct.balance,
    ccyCd: acct.currency,
  }));
};

/**
 * 取得當前所選帳號之交易明細
 * @param {*} request {
    actNo: 帳號, ex: 00100100063106,
    keyword: 文字檢索條件, ex: 退款.
    startDate: 交易日期起日, ex: 20200101,
    endDate: 交易日期迄日, ex: 20210731,
    tranType: 摘要代碼: 1:跨轉、2:ATM、3:存款息、4:薪轉、5:付款儲存、6:自動扣繳, 可多筆,
    dataMonth: 起始月份，預設為最接近月底的日期為起始索引, ex: 202104,
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
