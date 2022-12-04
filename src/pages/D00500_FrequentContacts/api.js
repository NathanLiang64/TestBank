import { callAPI } from 'utilities/axios';

/**
 * 查詢用戶自設的常用轉入帳號清單。
 * @returns [{
 *   bankId: 常用轉入帳戶-銀行代碼
 *   acctId: 常用轉入帳戶-帳號
 *   bankName: 銀行名稱
 *   nickName: 暱稱
 *   email: 通知EMAIL
 *   headshot: 代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。
 * }, ...]
 */
export const getAllFrequentAccount = async () => {
  const response = await callAPI('/api/transfer/frequentAccount/v1/getAll');
  return response.data;
};

/**
 * 新增常用轉入帳號。
 * @param {*} account {
 *   bankId: 常用轉入帳戶-銀行代碼
 *   acctId: 常用轉入帳戶-帳號
 *   nickName: 新暱稱；可為空值
 *   email: 新通知EMAIL；可為空值
 *   headshot: 代表圖檔的內容，使用 Base64 格式；若為 null 表示還沒有設定頭像。
 * }
 * @returns {Promise<String>} 代表常用轉入帳號的UUID識別碼，可用來顯示大頭貼；若為 null 表示新增失敗。
 */
export const addFrequentAccount = async (account) => {
  const response = await callAPI('/api/transfer/frequentAccount/v1/add', account);
  return response.data;
};

/**
 * 更新常用轉入帳號。
 * @param {*} account {
 *   bankId: 常用轉入帳戶-銀行代碼
 *   acctId: 常用轉入帳戶-帳號
 *   nickName: 新暱稱；可為空值
 *   email: 新通知EMAIL；可為空值
 *   orgBankId: 變更前 常用轉入帳戶-銀行代碼，未變更也需要有值。
 *   orgAcctId: 變更前 常用轉入帳戶-帳號，未變更也需要有值。
 *   headshot: 代表圖檔的內容，使用 Base64 格式；若為 null 表示還沒有設定頭像。
 * }
 * @returns {*}
 */
export const updateFrequentAccount = async (account) => {
  const response = await callAPI('/api/transfer/frequentAccount/v1/update', account);
  return response.data;
};

/**
 * 刪除常用轉入帳號。
 * @param {*} request {
 *   bankId: 常用轉入帳戶-銀行代碼
 *   acctId: 常用轉入帳戶-帳號
 * }
 * @returns {*}
 */
export const deleteFrequentAccount = async (request) => {
  const response = await callAPI('/api/transfer/frequentAccount/v1/delete', request);
  return response.data;
};
