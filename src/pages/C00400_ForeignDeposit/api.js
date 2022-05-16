import { callAPI } from 'utilities/axios';

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
 * 取得當前所選帳號之交易明細
 * @param {*} accountNo 存款帳號, ex: 00100100063106
 * @param {*} request currency 存款幣別
 */
export const getTransactionDetails = async (accountNo, currency) => {
  const response = await callAPI('/api/deposit/v1/queryAcctTxDtl', { accountNo, currency });
  return response.data;
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

/**
 * 設定指定外幣帳戶的主要幣別
 * @param {*} accountNo 存款帳號
 * @param {*} currency 主要幣別
 * @returns
 */
export const setAccountMainCurrency = async (accountNo, currency) => {
  const response = await callAPI('/api/deposit/v1/setAccountMainCurrency', { accountNo, currency });
  return response.data;
};
