import { callAPI } from 'utilities/axios';

/**
 * 取得帳號列表
 * @param {*} acctTypes 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @return [{
 *   account: 帳號,
 *   name: 帳戶名稱，若有暱稱則會優先用暱稱,
 *   transable: 已設約轉 或 同ID互轉(true/false)
 *   details: [{ // 外幣多幣別時有多筆
 *        balance: 帳戶餘額(非即時資訊), // TODO 依G0002的效能決定是否開放。
 *        currency: 幣別代碼,
 *   }, ...]
 * }, ...]
 */
export const getAccountsList = async (acctTypes) => {
  const response = await callAPI('/api/deposit/v1/getAccounts', acctTypes);
  return response.data.map((acct) => ({ acctNo: acct.account }));
};

// email 發送數位存摺
export const sendBankBookMail = async (param) => {
  const response = await callAPI('/api/deposit/v1/sendAcctTxDtl', param);
  return response;
};

// 取得 E-mail
export const getEmail = async (param) => {
  const response = await callAPI('/api/setting/custQuery', param);
  return response;
};
