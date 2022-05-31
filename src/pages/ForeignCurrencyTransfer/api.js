import { callAPI } from 'utilities/axios';

/**
 * 取得帳戶清單
 * @param {*} acctTypes 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @returns [{
 *   account: 帳號,
 *   name: 帳戶名稱，若有暱稱則會優先用暱稱,
 *   transable: 已設約轉 或 同ID互轉,
 *   details: [{ // 外幣多幣別時有多筆
 *     balance: 帳戶餘額,
 *     currency: 幣別代碼,
 *   }, ...]
 * }, ...]
 */
export const getAccountsList = async (acctTypes) => {
  const response = await callAPI('/api/deposit/v1/getAccounts', acctTypes);
  return response.data;
};

/**
 * 取得外幣交易性質別清單。
 * WebView：E00100換匯
 * @param request {
 *   trnsType, // 交易類別 - 空白:全查 1:台轉外 2:外轉台 3:外幣同幣別
 *   action, // 1:即時、2:預約(不支援快取)
 * }
 * @returns [{
 *   leglCode: 性質別代碼,
 *   leglDesc: 性質別說明,
 * }, ...]
 */
export const getExchangePropertyList = async (param) => {
  const response = await callAPI('/api/foreign/v1/getTransactionType', param);
  return response.data;
};

/**
 * 外幣轉帳。（限定約轉，未設有約定轉入帳號者，將無法使用）
 * @param {*} param {
 *   ...(很多)
 * }
 * @returns {
 *   ...(很多)
 * }
 */
export const exchangeNtoF = async (param) => {
  const response = await callAPI('/api/foreign/v1/transfer', param);
  return response.data;
};
