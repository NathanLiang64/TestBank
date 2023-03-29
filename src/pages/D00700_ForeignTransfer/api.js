import { setAgreAccts } from 'stores/reducers/CacheReducer';
import store from 'stores/store';
import { callAPI } from 'utilities/axios';
import { getBankCode } from 'utilities/CacheData';

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
  let { agreAccts } = store.getState()?.CacheReducer;
  if (!agreAccts) agreAccts = {};

  if (!agreAccts[accountNo]) {
    const response = await callAPI('/deposit/transfer/agreedAccount/v1/get', {
      accountNo,
    });
    const bankList = await getBankCode();
    agreAccts[accountNo] = response.data?.map((item) => ({
      ...item,
      bankName:
        bankList?.find((b) => b.bankNo === item.bankId)?.bankName
        ?? item.bankId,
    }));
    store.dispatch(setAgreAccts(agreAccts));
  }
  return agreAccts[accountNo];
};

/**
 * 取得外幣交易性質別清單。
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
 * 建立外幣轉帳。（限定約轉，未設有約定轉入帳號者，將無法使用）
 * @param {{
 *   outAccount: 轉出帳號,
 *   transIn: 轉入帳號,
 *   currency: 轉帳幣別,
 *   amount: 交易金額,
 *   property: 換匯性質,
 *   memo: 備註,
 * }} param
 * @returns {Promise<{
 *   result: 表示是否成功建立外轉外交易記錄,
 *   tfrId: 轉帳交易識別碼,
 *   message: 無法成功建立的原因,
 * }>}
 */
export const createTransfer = async (param) => {
  const response = await callAPI('/deposit/foreign/transfer/v1/create', param);
  return response.data;
};

/**
 * 執行外幣轉帳。（限定約轉，未設有約定轉入帳號者，將無法使用）
 * @param {String} tfrId 轉帳交易識別碼，用來更新交易紀錄
 * @returns {Promise<{
 *   result: 表示是否成功完成外轉外交易,
 *   balance: 轉帳交易完成後的帳戶餘額,
 *   errorCode: 表示交易失敗的錯誤代碼,
 *   message: 交易失敗的原因,
 * }>}
 */
export const executeTransfer = async (tfrId) => {
  const response = await callAPI('/deposit/foreign/transfer/v1/execute', tfrId);
  return response.data;
};
