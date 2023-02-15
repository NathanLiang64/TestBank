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

/**
 * 取得帳戶餘額及未出帳利息。
 * @param {String} accountNo 存款帳號
 * @returns {Promise<{
 *   balance: number //目前的帳戶的餘額
 *   interest: number //結算後的利息
 *   rate : number // 目前的利率
 * }>}
 */
export const getInterest = async (accountNo, currency) => {
  const response = await callAPI('/deposit/account/v1/getInterest', { accountNo, currency });
  return response.data;
};

/**
 * 查詢匯率行情
  @returns [
    {
      ccyname: 外幣幣別,
      ccycd: 外幣代碼,
      brate: 即時買進,
      srate: 即時賣出
    }
  ]
*/
export const getExchangeRateInfo = async () => {
  const response = await callAPI('/deposit/foreign/v1/getExRateInfo');
  return response.data;
};
