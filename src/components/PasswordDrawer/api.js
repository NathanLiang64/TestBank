import { callAPI } from 'utilities/axios';

/**
 * 取得需要使用者輸入驗證的項目。
 * @param {*} autoCode 要求進行的驗證模式的代碼。
 * @returns 驗證項目旗標。(0x01:生物辨識或圖形鎖, 0x02:網銀密碼)
 */
export const getTransactionAuthMode = async (autoCode) => {
  const response = await callAPI('/api/transactionAuth/v1/getAuthMode', autoCode);
  return response.data;
};

/**
 * 單元功能要求 建立交易授權驗證，必要時會發送OTP驗證碼簡訊，並依 otpMode 決定發送閘道及手機門號。
 * @param {*} request {
 *   funcCode: 要求發送OTP的單元功能。 這個欄位由 APP 從 FunctionController 取得。
 *   authCode: 要求進行的驗證模式的代碼。
 *   mobile: 簡訊識別碼發送的手機門號。當綁定或變更門號時，因為需要確認手機號碼的正確性，所以要再驗OTP
 * }
 * @returns {
 *   key: 本次要求驗證的金鑰，用來檢核使用者輸入
 *   otpSmsId: OTP簡訊中的識別碼。
 *   otpMobile: 簡訊識別碼發送的手機門號。
 * }
 */
export const createTransactionAuth = async (request) => {
  const response = await callAPI('/api/transactionAuth/v1/create', request);
  return response.data;
};

/**
 * 依指定的驗證模式，對使用者輸入的資料進行驗證。
 * @param {*} request {
 *   authKey: 本次要求驗證的金鑰，需透過 createTransactionAuth 取得。
 *   funcCode: 要求發送OTP的單元功能。 這個欄位由 APP 從 FunctionController 取得。
 *   auth2FA: 可以讓Server端確認真的通過驗證的資料，例：全景的驗證資料
 *   netbankPwd: 使用者輸入的「網銀密碼」，已做過 E2EE 加密。
 *   otpCode: 使用者輸入的「驗證碼」。
 * }
 * @returns {
 *   result: 驗證結果(true/false)
 *   message: 驗證失敗狀況描述。
 * }
 */
export const transactionAuthVerify = async (request) => {
  const response = await callAPI('/api/transactionAuth/v1/verify', request);
  return response.data;
};
