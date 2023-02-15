import { setAgreAccts } from 'stores/reducers/CacheReducer';
import store from 'stores/store';
import { callAPI } from 'utilities/axios';
import { getBankCode } from 'utilities/CacheData';

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

/**
 * 查詢是否為行員
 * @returns {Promise<Boolean>} 是否為本行員工
 */
export const isEmployee = async () => {
  const response = await callAPI('/personal/v1/queryFundGroup');
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

// 取得可交易幣別
export const getCcyList = async (param) => {
  const response = await callAPI('/deposit/foreign/v1/getCcyList', param);
  return response.data;
};

// 取得外幣交易性質列表
export const getExchangePropertyList = async (param) => {
  const response = await callAPI('/deposit/foreign/v1/getTransactionType', param);
  return response.data;
};

// 外幣換匯 N2F
export const exchangeNtoF = async (param) => {
  const response = await callAPI('/deposit/foreign/exchN2f', param);
  return response.data;
};

// 外幣換匯 F2N
export const exchangeFtoN = async (param) => {
  const response = await callAPI('/deposit/foreign/exchF2n', param);
  return response.data;
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
