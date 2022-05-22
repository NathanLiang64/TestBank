import { callAPI } from 'utilities/axios';

/**
 * 取得帳號列表
 * @param {*} acctTypes 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @returns { acctNo }
 */
export const getAccountsList = async (acctTypes) => {
  // * /api/deposit/v1/getAccounts Response [{
  // *   account: 帳號,
  // *   name: 帳戶名稱，若有暱稱則會優先用暱稱,
  // *   transable: 已設約轉 或 同ID互轉,
  // *   balances: [{ // 外幣多幣別時有多筆
  // *     balance: 帳戶餘額,
  // *     currency: 幣別代碼,
  // *   }, ...]
  // * }, ...]
  const response = await callAPI('/api/deposit/v1/getAccounts', acctTypes);
  return response.data.map((acct) => ({ acctNo: acct.account }));
};
