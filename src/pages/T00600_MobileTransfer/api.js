import { callAPI } from 'utilities/axios';

/**
 * 個人基本資料查詢
 * @returns {Promist<{
 *    custName, // 中文姓名
 *    mobile, // 手機
 *    email, // 電子郵件
 *    birthday, // 生日
 *    zipCode, // 郵遞區號
 *    county, // 寄送地址 - 城市
 *    city, //寄送地址 - 地區
 *    addr, //寄送地址 - 道路
 *    userData, //年收入,職稱,行業
 * }>}
 */
export const getProfile = async () => {
  const response = await callAPI('/api/setting/v1/getProfile');
  return response.data;
};

/**
 * 取得用戶名下所有手機收款的綁定設定資訊。
 * @returns {*} {
 *   bindQuickLogin: 是否已綁定快速登入。未綁定時，則不能使用手機收款。
 *   bindTxnOtpMobile: 是否已綁定非約轉交易OTP時所使用的手機號碼。
 *   bindCifMobile: 是否已留存個人聯絡手機號碼於優利CIF。
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
 *   isDefault: 是否做為預設收款手機號碼
 * }
 * @returns true:成功, false:失敗。
 */
export const createMobileNo = async (param) => {
  const response = await callAPI('/api/mobileAccount/v1/create', param);
  return response.data;
};

/**
 * 更新手機號碼收款設定
 * @param {String} account 綁定的銀行帳號
 * @returns true:成功, false:失敗。
 */
export const editMobileNo = async (account) => {
  const response = await callAPI('/api/mobileAccount/v1/update', account);
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
