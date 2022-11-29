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
 *   name:      帳戶名稱，若有暱稱則會優先用暱稱,
 *   transable: 已設約轉 或 同ID互轉(true/false)
 *   details: [{ // 外幣多幣別時有多筆
 *        balance: 帳戶餘額(非即時資訊)
 *        currency: 幣別代碼,
 *   }, ...]
 * }, ...]
 */
export const getAccountsList = async (acctTypes) => {
  const response = await callAPI('/api/deposit/v1/getAccounts', acctTypes);
  return response.data;
};

/**
 * 取得用戶名下所有手機收款的綁定設定資訊。
 * @returns {*} {
 *   bindQuickLogin: 是否(Y/N)已綁定快速登入。未綁定(N)時，則不能使用手機收款。
 *   bindTxnOtpMobile: 是否(Y/N)已綁定非約轉交易OTP時所使用的手機號碼。
 *   bindCifMobile: 是否(Y/N)已留存個人聯絡手機號碼於優利CIF。
 *   mobiles: [], 可用來綁定的手機號碼清單，但不包含已綁定的手機號碼,
 *   bindings: [{
 *     mobile: 表示收款帳戶的手機號碼,
 *     account: 綁定的銀行帳號,
 *     status: 狀態（1:有效, 0:無效）,
 *     isDefault: 表示預設的收款手機號碼,
 *   }, ...]
 * }
 */
export const fetchMobiles = async () => {
  const response = await callAPI('/api/mobileAccount/v1/getBindingSummary');
  return response.data;
};

/**
 * 手機號碼收款設定新增
 * @param request {
 *   account: 綁定的銀行帳號,
 *   isDefault: 是否(Y/N)做為預設收款手機號碼
 * }
 * @returns true:成功, false:失敗。
 */
export const createMobileNo = async (param) => {
  const response = await callAPI('/api/mobileAccount/v1/create', param);
  return response.data;
};

/**
 * 更新手機號碼收款設定
 * @param request {
 *   account: 綁定的銀行帳號,
 *   isDefault: 是否(Y/N)做為預設收款手機號碼
 * }
 * @returns true:成功, false:失敗。
 */
export const editMobileNo = async (param) => {
  const response = await callAPI('/api/mobileAccount/v1/update', param);
  return response.data;
};

/**
 * 解除手機號碼收款綁定
 * @returns true:成功, false:失敗。
 */
export const unbindMobileNo = async () => {
  const response = await callAPI('/api/mobileAccount/v1/unbind');
  return response.data;
};
