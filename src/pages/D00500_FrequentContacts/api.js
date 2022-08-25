import { callAPI } from 'utilities/axios';

/**
 * 查詢銀行代碼
 * @returns {
 *   bankNo: 銀行代碼。
 *   bankName: 銀行名稱。
 * }
 */
export const getBankCode = async (params) => {
  const response = await callAPI('/api/transfer/queryBank', params);
  return response.data;
};

/**
 * 查詢用戶自設的常用轉入帳號清單。
 * @returns [{
 *   bankId: 常用轉入帳戶-銀行代碼
 *   acctId: 常用轉入帳戶-帳號
 *   bankName: 銀行名稱
 *   nickName: 暱稱
 *   email: 通知EMAIL
 *   headshot: 大頭照，只有常用轉入帳戶是Bankee會員才會有值。若為 null 表示沒有頭像。
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
 * }
 * @returns {
 *   bankId: 常用轉入帳戶-銀行代碼
 *   acctId: 常用轉入帳戶-帳號
 *   bankName: 銀行名稱
 *   nickName: 暱稱
 *   email: 通知EMAIL
 *   headshot: 大頭照，只有常用轉入帳戶是Bankee會員才會有值。若為 null 表示沒有頭像。
 * }
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
 * }
 * @returns {
 *   bankId: 常用轉入帳戶-銀行代碼
 *   acctId: 常用轉入帳戶-帳號
 *   bankName: 銀行名稱
 *   nickName: 暱稱
 *   email: 通知EMAIL
 *   headshot: 大頭照，只有常用轉入帳戶是Bankee會員才會有值。若為 null 表示沒有頭像。
 * }
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
 * @returns {
 *   bankId: 常用轉入帳戶-銀行代碼
 *   acctId: 常用轉入帳戶-帳號
 *   bankName: 銀行名稱
 *   nickName: 暱稱
 *   email: 通知EMAIL
 *   headshot: 大頭照，只有常用轉入帳戶是Bankee會員才會有值。若為 null 表示沒有頭像。
 * }
 */
export const deleteFrequentAccount = async (request) => {
  const response = await callAPI('/api/transfer/frequentAccount/v1/delete', request);
  return response.data;
};
