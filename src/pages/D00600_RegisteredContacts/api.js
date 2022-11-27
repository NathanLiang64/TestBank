import { callAPI } from 'utilities/axios';

/**
 * 查詢指定轉出帳號約定轉入帳號清單。
 * @param {*} accountNo 要查詢約定轉入帳號清單的帳號。
 * @returns [{
 *   bankId: 約定轉入帳戶-銀行代碼
 *   acctId: 約定轉入帳戶-帳號
 *   isManyCcy: 是否為多幣別帳號 // TODO 不確定用途，目前都是傳回"00"
 *   bankName: 銀行名稱
 *   nickName: 暱稱
 *   email: 通知EMAIL
 * }, ...]
 */
export const getAllAgreedAccount = async (accountNo) => {
  const response = await callAPI('/api/transfer/agreedAccount/v1/getAll', { accountNo });
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
 * @returns [{
 *   bankId: 約定轉入帳戶-銀行代碼
 *   acctId: 約定轉入帳戶-帳號
 *   nickName: 暱稱
 *   email: 通知EMAIL
 *   headshot: 大頭照，只有常用轉入帳戶是Bankee會員才會有值。若為 null 表示沒有頭像。
 * }, ...]
 */
export const updateAgreedAccount = async (request) => {
  const response = await callAPI('/api/transfer/agreedAccount/v1/update', request);
  return response.data;
};
