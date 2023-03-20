import { callAPI } from 'utilities/axios';
import { getBankCode } from 'utilities/CacheData';
import { setAgreAccts } from 'stores/reducers/CacheReducer';
import store from 'stores/store';

/**
 * 查詢指定轉出帳號約定轉入帳號清單。
 * @param {{
 *   accountNo: String, // 要查詢約定轉入帳號清單的帳號。
 * }} accountNo
 * @returns {Promise<[{
 *   bankId: '約定轉入帳戶-銀行代碼'
 *   acctId: '約定轉入帳戶-帳號'
 *   bankName: '銀行名稱'
 *   nickName: '暱稱'
 *   email: '通知EMAIL'
 *   isSelf: '是否為本行自己的其他帳戶'
 *   headshot: '代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。'
 * }]>} 約定轉入帳號清單。
 */
export const getAgreedAccount = async (accountNo) => {
  let {agreAccts} = store.getState()?.CacheReducer;
  if (!agreAccts) agreAccts = {};
  const request = { accountNo };
  if (!agreAccts[accountNo]) {
    const response = await callAPI('/deposit/transfer/agreedAccount/v1/get', request);
    const bankList = await getBankCode();
    agreAccts[accountNo] = response.data?.map((item) => ({
      ...item,
      bankName: (bankList?.find((b) => b.bankNo === item.bankId)?.bankName ?? item.bankId),
    }));
    store.dispatch(setAgreAccts(agreAccts));
  }
  return agreAccts[accountNo];
};

/**
 * 更新指定約定轉入帳號的暱稱或通知EMAIL。
 * @param {String} accountNo 要查詢約定轉入帳號清單的帳號。
 * @param {{
 *   bankId: '約定轉入帳戶-銀行代碼'
 *   acctId: '約定轉入帳戶-帳號'
 *   nickName: '新暱稱；若為空字串，則表示清除，若為null，則表示不變。'
 *   email: '新通知EMAIL；若為空字串，則表示清除，若為null，則表示不變。'
 *   headshot: '代表圖檔的內容，使用 Base64 格式；若為 null 表示還沒有設定頭像。'
 * }} request
 * @returns {Promise<String>} 代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。
 */
export const updateAgreedAccount = async (accountNo, request) => {
  const response = await callAPI('/deposit/transfer/agreedAccount/v1/update', request);
  const headshotId = response.data;

  // 更新約定轉入帳號快取。
  const {agreAccts} = store.getState()?.CacheReducer;
  const accounts = agreAccts[accountNo];

  const index = accounts.findIndex((account) => account.bankId === request.bankId && account.acctId === request.acctId);
  if (request.nickName) accounts[index].nickName = request.nickName;
  if (request.email) accounts[index].email = request.email;
  if (request.headshot) accounts[index].headshot = headshotId;
  store.dispatch(setAgreAccts(agreAccts));

  return [...accounts]; // 需要回傳新的物件 給 setState，以觸發再次渲染
};
