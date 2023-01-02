import { callAPI } from 'utilities/axios';

/**
 * 查詢匯率行情
  @param { }
  @returns [
    {
      ccyname: 外幣幣別,
      ccycd: 外幣代碼,
      brate: 即時買進,
      srate: 即時賣出
    }
  ]
*/
export const getExchangeRateInfo = async (param) => {
  const response = await callAPI('/api/frgn/queryRateInfo', param);
  return response;
};

// 查詢是否為行員
export const isEmployee = async (param) => {
  const response = await callAPI('/api/queryFundGroup', param);
  return response.data;
};

/**
 * 取得帳戶清單
 * @param {*} acctTypes 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @returns [{
 *   account: 帳號,
 *   name:      帳戶名稱，若有暱稱則會優先用暱稱,
 *   transable: 已設約轉 或 同ID互轉(true/false)
 *   details: [{ // 外幣多幣別時有多筆
 *        balance: 帳戶餘額(非即時資訊)
 *        currency: 幣別代碼,
 *   }, ...]
 * }, ...]
 */
export const getAccountsList = async (acctTypes) => {
  const response = await callAPI('/api/deposit/v1/getAccounts', acctTypes);
  return response.data;
};

// Booking: '20.68000';
// CashAskRate: '0.00000';
// CashBidRate: '0.00000';
// Currency: 'AUD';
// CurrencyName: '澳幣';
// DataType: 'REAL';
// QueryDate: '20221230';
// SpotAskRate: '20.84000'; // 客戶 台轉外
// SpotBidRate: '20.51000'; // 客戶 外轉台
// UpdateDateTime: '2022-12-29T15:44:11.957';

// 取得可交易幣別
export const getCcyList = async (param) => {
  const response = await callAPI('/api/foreign/v1/queryRealUniRate', param);
  return response.data;
};

// 取得外幣交易性質列表
export const getExchangePropertyList = async (param) => {
  const response = await callAPI('/api/foreign/v1/getTransactionType', param);
  return response.data;
};

// 外幣換匯 N2F
export const exchangeNtoF = async (param) => {
  const response = await callAPI('/api/frgn/exchN2f', param);
  return response.data;
};

// 外幣換匯 F2N
export const exchangeFtoN = async (param) => {
  const response = await callAPI('/api/frgn/exchF2n', param);
  return response.data;
};
