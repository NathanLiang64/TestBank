import { callAPI } from 'utilities/axios';

/**
 * 取得當前所選帳號之交易明細
 * @param {*} accountNo 存款帳號, ex: 00100100063106
 * @param {*} request currency 存款幣別
 */
export const getTransactions = async (accountNo, currency) => {
  const response = await callAPI('/deposit/account/v1/getTransactions', { accountNo, currency });
  return response.data;
};

/**
 * 設定存款帳戶別名
 * @param {*} accountNo 存款帳號
 * @param {*} alias 帳戶別名；若為空值，則會恢復原始帳戶名稱
 * @returns
 */
export const setAccountAlias = async (accountNo, alias) => {
  const response = await callAPI('/deposit/account/v1/setAccountAlias', { accountNo, alias });
  return response.data;
};

/**
 * 設定指定外幣帳戶的主要幣別
 * @param {*} accountNo 存款帳號
 * @param {*} currency 主要幣別
 * @returns
 */
export const setMainCurrency = async (accountNo, currency) => {
  const response = await callAPI('/deposit/foreign/v1/setMainCurrency', { accountNo, currency });
  return response.data;
};
