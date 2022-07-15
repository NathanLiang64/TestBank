import { callAPI } from 'utilities/axios';

// // 查詢約定帳號 - Adrian
// export const getRegAccounts = (params) => (
//   userRequest('post', '/api/transfer/queryRegAcct', params)
// );

/**
 * 查詢指定轉出帳號約定轉入帳號清單。
 * @param {*} accountNo 要查詢約定轉入帳號清單的帳號。
 * @returns [{
 *   bankId: 約定轉入帳戶-銀行代碼
 *   acctId: 約定轉入帳戶-帳號
 *   isManyCcy: 是否為多幣別帳號 // TODO 目前應該是無值，因為MBGW沒看到！
 *   bankName: 銀行名稱 // TODO 目前應該是無值，因為MBGW沒看到！
 *   nickName: 暱稱
 *   email: 通知EMAIL
 * }, ...]
 */
export const getAllRegisteredAccount = async (accountNo) => {
  const response = await callAPI('/api/transfer/v1/getAllRegisteredAccount', { accountNo });
  return response.data;
};

/**
 * 更新指定約定轉入帳號的暱稱或通知EMAIL。
 * @param {*} request {
 *   bankId: 約定轉入帳戶-銀行代碼
 *   acctId: 約定轉入帳戶-帳號
 *   nickName: 新暱稱；若為空字串，則表示清除，若為null，則表示不變。
 *   email: 新通知EMAIL；若為空字串，則表示清除，若為null，則表示不變。
 * }
 * @returns
 */
export const updateRegisteredAccount = async (request) => {
  const response = await callAPI('/api/transfer/v1/updateRegisteredAccount', request);
  return response.data;
};

// // 編輯單筆約定帳號 - Adrian
// export const updateRegAccount = (params) => (
//   userRequest('post', '/api/transfer/modifyRegAcct', params)
// );
