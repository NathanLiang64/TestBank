import { setAgreAccts } from 'stores/reducers/CacheReducer';
import store from 'stores/store';
import { callAPI } from 'utilities/axios';
import { getBankCode } from 'utilities/CacheData';

/**
 * 查詢是否為行員
 * @returns {Promise<Boolean>} 是否為本行員工
 */
export const isEmployee = async () => {
  const response = await callAPI('/personal/v1/queryFundGroup');
  return response.data.isEmployee;
};

/**
 * 查詢匯率行情
  @returns [
    {
      ccyname: 外幣幣別,
      ccycd: 外幣代碼,
      brate: 即時買進,
      srate: 即時賣出
    }
  ]
*/
export const getExchangeRateInfo = async () => {
  const response = await callAPI('/deposit/foreign/queryRateInfo');
  return response.data;
};

// Booking: '20.68000';
// CashAskRate: '0.00000';
// CashBidRate: '0.00000';
// Currency: 'AUD';
// CurrencyName: '澳幣';
// DataType: 'REAL';
// QueryDate: '20221230';
// SpotAskRate: '20.84000'; // 客戶 台轉外
// SpotBidRate: '20.51000'; // 客戶 外轉台
// UpdateDateTime: '2022-12-29T15:44:11.957';

// 取得可交易幣別(全行共用，可用Cache)
export const getCcyList = async (param) => {
  const response = await callAPI('/deposit/foreign/v1/getCcyList', param);
  return response.data;
};

// 取得外幣交易性質列表(全行共用，可用Cache)
export const getExchangePropertyList = async (param) => {
  const response = await callAPI('/deposit/foreign/v1/getTransactionType', param);
  return response.data;
};

/**
 * 建立外幣換匯、轉帳交易紀錄
 * @param {{
 *   mode: Number, // 0.尚未初始化, 1.新臺幣轉外幣, 2.外幣轉新臺幣
 *   outAccount: String, // 轉出帳號
 *   currency: String, // 兌換使用的幣別(mode => 1.轉入幣別, 2.轉出幣別)
 *   inAccount: String, // 轉入帳號
 *   inAmount: Number, // 轉入(兌換)金額
 *   inAmtMode: Number, // 轉入(兌換)金額的幣別模式（1.currency, 2.台幣)
 *   property: String, // 性質別
 *   memo: String, // 備註
 * }} request
 * @returns {Promise<{
 *   tfrId: String, // 執行外幣換匯、轉帳時的交易序號
 *   countdown: Number, // 取匯有效時限（即到數秒數）
 *   exRate: Number, // 取交易匯率序號所得的匯率
 *   outAmount: Number, // 以 exRate 計算兌換所需的轉出金額
 *   balance: Number, // 兌換後的轉出帳戶餘額
 * }>}
 */
export const create = async (request) => {
  const response = await callAPI('/deposit/foreign/exchange/v1/create', request);
  return response.data;
};

/**
 * 執行外幣換匯、轉帳交易
 * @param {String} tfrId 執行外幣換匯、轉帳時的交易序號
 * @returns {
 *    isSuccess,
 *    balance: 轉出後餘額,
 *    errorCode,
 *    message: 錯誤訊息,
 * }
 */
export const execute = async (tfrId) => {
  const response = await callAPI('/deposit/foreign/exchange/v1/execute', tfrId);
  return {
    ...response.data,
    isSuccess: (response.isSuccess && !response.data.errorCode),
  };
};

/**
 * 查詢指定轉出帳號約定轉入帳號清單。
 * @param {{
 *   accountNo: String, // 要查詢約定轉入帳號清單的帳號。
 *   includeSelf: Boolean, // 表示傳回清單要包含同ID互轉的帳號。
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
  const request = {
    accountNo,
    includeSelf: true, // 現在一律連同ID底下的帳號也一並取出，透過 CacheReducer 管理，後續再依照選取模式 filter
  };
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
