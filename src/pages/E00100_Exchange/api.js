import { callAPI } from 'utilities/axios';

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
  const response = await callAPI('/deposit/foreign/queryRateInfo');
  return response.data;
};

/**
 * 查詢是否為行員
 * @returns {Promise<Boolean>} 是否為本行員工
 */
export const isEmployee = async () => {
  const response = await callAPI('/personal/v1/queryFundGroup');
  return response.data.isEmployee;
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
  const response = await callAPI('/deposit/foreign/v1/queryRealUniRate', param);
  return response.data;
};

// 取得外幣交易性質列表
export const getExchangePropertyList = async (param) => {
  const response = await callAPI('/deposit/foreign/v1/getTransactionType', param);
  return response.data;
};

// 外幣換匯 N2F
export const exchangeNtoF = async (param) => {
  const response = await callAPI('/deposit/foreign/exchN2f', param);
  return response.data;
};

// 外幣換匯 F2N
export const exchangeFtoN = async (param) => {
  const response = await callAPI('/deposit/foreign/exchF2n', param);
  return response.data;
};
