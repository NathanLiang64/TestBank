import { callAPI } from 'utilities/axios';
import { setFreqAccts } from 'stores/reducers/CacheReducer';
import store from 'stores/store';

/**
 * 查詢用戶自設的常用轉入帳號清單。
 * @returns {Promise<[{
 *   bankId: '常用轉入帳戶-銀行代碼'
 *   acctId: '常用轉入帳戶-帳號'
 *   bankName: '銀行名稱'
 *   nickName: '暱稱'
 *   email: '通知EMAIL'
 *   headshot: '代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。'
 * }]>} 常用轉入帳號清單。
 */
export const getFrequentAccount = async () => {
  let {freqAccts} = store.getState()?.CacheReducer;
  if (!freqAccts) {
    const response = await callAPI('/api/transfer/frequentAccount/v1/getAll');
    freqAccts = response.data;
    store.dispatch(setFreqAccts(freqAccts));
  }
  return freqAccts;
};

/**
 * 新增常用轉入帳號。
 * @param {{
 *   bankId: '常用轉入帳戶-銀行代碼'
 *   acctId: '常用轉入帳戶-帳號'
 *   nickName: '新暱稱；可為空值'
 *   email: '新通知EMAIL；可為空值'
 *   headshot: '代表圖檔的內容，使用 Base64 格式；若為 null 表示還沒有設定頭像。'
 * }} account
 * @returns {Promise<[{
 *   bankId: '常用轉入帳戶-銀行代碼'
 *   acctId: '常用轉入帳戶-帳號'
 *   bankName: '銀行名稱'
 *   nickName: '暱稱'
 *   email: '通知EMAIL'
 *   headshot: '代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。'
 * }]} 傳回刪除指定項目後的清單。
 */
export const addFrequentAccount = async (account) => {
  const response = await callAPI('/api/transfer/frequentAccount/v1/add', account);
  const headshotId = response.data;

  // 將新帳號加入快取。
  const {freqAccts} = store.getState()?.CacheReducer;
  const newAccount = {
    ...account,
    headshot: headshotId,
    isNew: true,
  };
  freqAccts.splice(0, 0, newAccount); // 插入到第一筆。
  store.dispatch(setFreqAccts(freqAccts));

  return freqAccts;
};

/**
 * 更新常用轉入帳號。
 * @param {{
 *   bankId: 常用轉入帳戶-銀行代碼
 *   acctId: 常用轉入帳戶-帳號
 *   bankName: '銀行名稱'
 *   nickName: 新暱稱；可為空值
 *   email: 新通知EMAIL；可為空值
 *   headshot: 代表圖檔的內容，使用 Base64 格式；若為 null 表示還沒有設定頭像。
 * }} newAccount 要更新的資料
 * @param {{
 *   orgBankId: '變更前 常用轉入帳戶-銀行代碼，未變更也需要有值。'
 *   orgAcctId: '變更前 常用轉入帳戶-帳號，未變更也需要有值。'
 * }} condition 要刪除的項目
 * @returns {Promise<[{
 *   bankId: '常用轉入帳戶-銀行代碼'
 *   acctId: '常用轉入帳戶-帳號'
 *   bankName: '銀行名稱'
 *   nickName: '暱稱'
 *   email: '通知EMAIL'
 *   headshot: '代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。'
 * }]} 傳回刪更新後的清單。
 */
export const updateFrequentAccount = async (newAccount, condition) => {
  const isChangeAccount = (newAccount.bankId !== condition.orgBankId || newAccount.acctId !== condition.orgAcctId);
  const request = {
    ...newAccount,
    ...condition,
  };
  delete request.bankName;
  const response = await callAPI('/api/transfer/frequentAccount/v1/update', request);
  const headshotId = response.data;

  // 更新常用轉入帳號快取。
  const {freqAccts} = store.getState()?.CacheReducer;
  const index = freqAccts.findIndex((account) => account.bankId === condition.orgBankId && account.acctId === condition.orgAcctId);
  const account = freqAccts[index];
  if (isChangeAccount) account.bankId = newAccount.bankId;
  if (isChangeAccount) account.acctId = newAccount.acctId;
  if (newAccount.nickName) account.nickName = newAccount.nickName;
  if (newAccount.email) account.email = newAccount.email;
  if (newAccount.headshot) account.headshot = headshotId;
  store.dispatch(setFreqAccts(freqAccts));

  return freqAccts;
};

/**
 * 刪除常用轉入帳號，傳回刪除指定項目後的清單。
 * @param {{
 *   bankId: '常用轉入帳戶-銀行代碼'
 *   acctId: '常用轉入帳戶-帳號'
 * }} condition 要刪除的項目
 * @returns {[{
 *   bankId: '常用轉入帳戶-銀行代碼'
 *   acctId: '常用轉入帳戶-帳號'
 *   bankName: '銀行名稱'
 *   nickName: '暱稱'
 *   email: '通知EMAIL'
 *   headshot: '代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。'
 * }]} 傳回刪除指定項目後的清單。
 */
export const deleteFrequentAccount = (condition) => {
  // 更新常用轉入帳號快取。
  const {freqAccts} = store.getState()?.CacheReducer;
  const index = freqAccts.findIndex((account) => account.bankId === condition.bankId && account.acctId === condition.acctId);
  freqAccts.splice(index, 1);
  store.dispatch(setFreqAccts(freqAccts));

  callAPI('/api/transfer/frequentAccount/v1/delete', condition);

  return freqAccts;
};
