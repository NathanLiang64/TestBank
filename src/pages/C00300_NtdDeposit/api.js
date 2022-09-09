import { callAPI, download } from 'utilities/axios';
import { stringDateCodeFormatter } from 'utilities/Generator';

/**
 * 取得存款帳戶卡片所需的資訊
 * @param {*} acctType 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @returns 存款帳戶資訊。
 */
export const getAccountSummary = async (acctTypes) => {
  const response = await callAPI('/api/deposit/v1/getAccountSummary', acctTypes);
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
 * 取得當前所選帳號之交易明細
 * @param {*} accountNo 存款帳號, ex: 00100100063106
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
export const getTransactions = async (accountNo) => {
  const response = await callAPI('/api/deposit/v1/getTransactions', { accountNo, currency: 'TWD' });
  return response.data;
};

/**
 * 下載存摺封面
 * @param {*} accountNo 存款帳號
 * @param {*} currency 幣別代碼，預設為台幣(TWD)
 * @returns 存摺封面
 */
export const downloadDepositBookCover = async (accountNo, currency = 'TWD') => {
  const today = stringDateCodeFormatter(new Date()); // 今天 yyyyMMdd
  const filename = `${accountNo}-${today}.pdf`;
  await download('/api/deposit/v1/getDepositBookCover', { accountNo, currency }, filename);
};

/**
 * 設定存款帳戶別名
 * @param {*} accountNo 存款帳號
 * @param {*} alias 帳戶別名；若為空值，則會恢復原始帳戶名稱
 * @returns
 */
export const setAccountAlias = async (accountNo, alias) => {
  const response = await callAPI('/api/deposit/v1/setAccountAlias', { accountNo, alias });
  return response.data;
};
