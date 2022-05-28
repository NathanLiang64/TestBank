/**
 * // DEBUG
 * 這些 API 是用來模擬 APP 功能用的，並非提供給 WebView 使用！
 */

import { callAPI } from 'utilities/axios';

/**
 * 單元功能要求發送OTP驗證碼簡訊，並依 otpMode 決定發送閘道及手機門號。
 * @param {*} funcCode: 要求發送OTP的單元功能。 這個欄位由 APP 從 FunctionController 取得。
 * @param {*} otpMode: OTP模式(11/12/21/22)，十位數：1＝MBGW,2=APPGW、個位數：1=發送至非約轉門號, 2=發送至CIF門號
 * @returns {
 *   transId: OTP簡訊中的識別碼。
 * }
 */
export const sendOtpCode = async (funcCode, otpMode) => {
  const response = await callAPI('/api/v1/sendOtp', { funcCode, otpMode });
  return response.data;
};

/**
 * 單元功能要求檢驗使用者輸入的OTP驗證碼。
 * @param {*} funcCode: 要求發送OTP的單元功能。 這個欄位由 APP 從 FunctionController 取得。
 * @param {*} otpCode: 使用者輸入的驗證碼。
 * @returns {
 *   result: 驗證結果。 true/false
 *   message: 檢查結果說明。
 * }
 */
export const veriifyOtp = async (funcCode, otpCode) => {
  const response = await callAPI('/api/v1/veriifyOtp', { funcCode, otpCode });
  return response.data;
};
