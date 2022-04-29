import { callAPI, downloadPDF } from 'utilities/axios';
import { stringDateCodeFormatter } from 'utilities/Generator';

/**
 * 取得存款帳戶卡片所需的資訊
 * @param {*} acctType 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @returns 存款帳戶資訊。
 */
export const getAccountSummary = async (acctTypes) => {
  const response = await callAPI('/api/deposit/v1/accountSummary', acctTypes);
  return response.data.map((acct) => ({
    acctBranch: acct.branch, // 分行名稱
    acctName: acct.name, // 帳戶名稱或暱稱
    acctId: acct.account, // 帳號
    acctType: acct.type, // 帳號類別
    acctBalx: acct.balance, // 帳戶餘額
    ccyCd: acct.currency, // 幣別代碼
  }));
};

/**
 * 取得取得免費跨提/跨轉次數、數存優惠利率及資訊
 * @param {*} accountNo 存款帳號
 * @returns 優惠資訊
  {
   "freeWithdrawal": 6, // 免費跨提
   "freeTransfer": 6, // 免費跨轉
   "bonusQuota": 50000, // 優惠利率額度
   "bonusRate": 0.081, // 優惠利率
   "interest": 1999, // 累積利息
  }
 */
export const getDepositBonus = async (accountNo) => {
  const response = await callAPI('/api/depositPlus/v1/getBonusInfo', accountNo);
  return response.data;
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

/**
 * 下載存摺封面
 * @param {*} accountNo 存款帳號
 * @param {*} currency 幣別代碼，預設為台幣(NTD)
 * @returns 存摺封面
 */
export const downloadDepositBookCover = async (accountNo, currency = 'NTD') => {
  const today = stringDateCodeFormatter(new Date()); // 今天 yyyyMMdd
  const filename = `${accountNo}-${today}.pdf`;
  await downloadPDF('/api/deposit/v1/getDepositBookCover', { accountNo, currency }, filename);
};
