import { callAPI } from 'utilities/axios';

// 取得姓名
export const fetchName = async () => {
  const response = await callAPI('/api/setting/custQuery', {});
  return response.data;
};

/**
 * 取得帳戶清單
 * @param {*} acctTypes 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @returns [{
 *   account: 帳號,
 *   name: 帳戶名稱，若有暱稱則會優先用暱稱,
 *   transable: 已設約轉 或 同ID互轉,
 *   details: [{ // 外幣多幣別時有多筆
 *     balance: 帳戶餘額,
 *     currency: 幣別代碼,
 *   }, ...]
 * }, ...]
 */
export const getAccountsList = async () => {
  const response = await callAPI('/api/deposit/v1/getAccounts');
  return response.data;
};

/**
 * 查詢可綁定手機及狀態
 * @param {*} request {
 *   tokenStatus,  綁定代號狀態 1: 有效，0: 無效
 * }
 * @returns {*} {
 *   otpMobile: 綁定OTP的手機號碼,
 *   cifMobile: 優利CIF個人基本資料中留存的手機號碼,
 *   mobiles: [], 可綁定手機清單,
 *   bindQuickLogin: 是否(Y/N)已綁定快速登入。未綁定(N)時，則不能使用手機收款。
 *   bindings: [{
 *     mobile: 表示收款帳戶的手機號碼,
 *     bankCode: 銀行代碼,
 *     account: 銀行帳號,
 *     token: 門號綁定代碼, 例：FEIB20211125040408ndIbKTrFdIMITG
 *     tokenStatus: 狀態（1:有效, 0:無效）,
 *     isDefault: 表示預設的收款手機號碼,
 *   }, ...]
 * }
 */
export const fetchMobiles = async (request) => {
  const response = await callAPI('/api/mpt/queryMobile', request);
  return response.data;
};

// // 取得已綁定銀行帳號清單
// export const getUserActNo = async (param) => {
//   const response = await callAPI('/api/mpt/userActNo', param);
//   return response.data;
// };

/**
 * 手機號碼收款設定新增
 * @param token
 * @param request {
 *   mobile: 綁定的手機號碼,
 *   bankCode: 綁定的銀行代碼,
 *   account: 綁定的銀行帳號,
 *   isDefault: 是否(Y/N)做為預設收款手機號碼
 *   otpCode: OTP 6位數字驗證碼, // TODO 由 APP 透過 localStorage 傳回。
 * }
 * @return true:成功, false:失敗。
 * @throws Exception
 */
export const createMobileNo = async (param) => {
  const response = await callAPI('/api/mpt/userCreate', param);
  return response.data;
};

/**
 * 手機號碼收款設定更新
 * @param token
 * @param request {
 *   mobile: 綁定的手機號碼,
 *   bankCode: 綁定的銀行代碼, // TODO ??? 不用嗎？
 *   account: 綁定的銀行帳號,
 *   otpCode: OTP 6位數字驗證碼, // TODO 由 APP 透過 localStorage 傳回。
 * }
 * @return true:成功, false:失敗。
 * @throws Exception
 */
export const editMobileNo = async (param) => {
  const response = await callAPI('/api/mpt/userChgAcct', param);
  return response.data;
};

/**
 * 手機號碼收款設定取消客戶綁定
 * @param token
 * @param request {
 *   mobile: 綁定的手機號碼,
 *   otpCode: OTP 6位數字驗證碼, // TODO 由 APP 透過 localStorage 傳回。
 * }
 * @return true:成功, false:失敗。
 * @throws Exception
 */
export const unbindMobileNo = async (param) => {
  const response = await callAPI('/api/mpt/userUnbind', param);
  return response.data;
};
