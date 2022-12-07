import { callAPI } from 'utilities/axios';
import { getBankCode } from 'utilities/CacheData';

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
 *   headshot: 代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。
 *   isSelf: 表示這是自己在本行的其他帳戶。
 * }, ...]
 */
export const getAgreedAccount = async (accountNo) => {
  const response = await callAPI('/api/transfer/agreedAccount/v1/get', { accountNo });
  const bankList = await getBankCode();
  const data = response.data?.map((item) => ({
    ...item,
    bankName: (bankList?.find((b) => b.bankNo === item.bankId)?.bankName ?? ''),
  }));
  console.log(data);
  return data;
};

/**
 * 更新指定約定轉入帳號的暱稱或通知EMAIL。
 * @param {*} request {
 *   bankId: 約定轉入帳戶-銀行代碼
 *   acctId: 約定轉入帳戶-帳號
 *   nickName: 新暱稱；若為空字串，則表示清除，若為null，則表示不變。
 *   email: 新通知EMAIL；若為空字串，則表示清除，若為null，則表示不變。
 *   headshot: 代表圖檔的內容，使用 Base64 格式；若為 null 表示還沒有設定頭像。
 * }
 * @returns [{
 *   bankId: 約定轉入帳戶-銀行代碼
 *   acctId: 約定轉入帳戶-帳號
 *   nickName: 暱稱
 *   email: 通知EMAIL
 *   headshot: 代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。
 * }, ...]
 */
export const updateAgreedAccount = async (request) => {
  const response = await callAPI('/api/transfer/agreedAccount/v1/update', request);
  return response.data;
};
