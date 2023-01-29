import { callAPI } from 'utilities/axios';

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
  const response = await callAPI('/deposit/account/v1/getAccounts', acctTypes);
  return response.data;
};

/**
 * 查詢約定轉入帳號清單。
 * @param {*} accountNo 要查詢的帳號。
 * @returns {Promise<[{
 *   bankId: 約定轉入帳戶銀行代碼
 *   acctId: 約定轉入帳戶帳號
 * }]>}
 */
export const getAgreedAccounts = async (accountNo) => {
  const response = await callAPI('/deposit/transfer/agreedAccount/v1/get', { accountNo });
  return response.data;
};

/**
 * 取得外幣交易性質別清單。
 * WebView：E00100換匯
 * @param request {
 *   trnsType, // 交易類別 - 空白:全查 1:不區分 2:台外互轉 3:同幣別互轉
 * }
 * @returns [{
 *   leglCode: 性質別代碼,
 *   leglDesc: 性質別說明,
 * }, ...]
 */
export const getExchangePropertyList = async (param) => {
  const response = await callAPI('/deposit/foreign/v1/getTransactionType', param);
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
export const transferFtoF = async (param) => {
  const response = await callAPI('/deposit/foreign/v1/transfer', param);
  return response.data;
};

/**
 * 建立外幣轉帳。（限定約轉，未設有約定轉入帳號者，將無法使用）
 * @param {*} param {
 *   ...(很多)
 * }
 * @returns {
 *   ...(很多)
 * }
 */
export const createTransfer = async (param) => {
  const response = await callAPI('/deposit/foreign/transfer/v1/create', param);
  return response.data;
};

/**
 * 執行外幣轉帳。（限定約轉，未設有約定轉入帳號者，將無法使用）
 * @param {*} param {
 *   ...(很多)
 * }
 * @returns {
 *   ...(很多)
 * }
 */
export const executeTransfer = async (param) => {
  const response = await callAPI('/deposit/foreign/transfer/v1/execute', param);
  return response.data;
};
