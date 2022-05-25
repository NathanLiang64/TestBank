import userAxios, { userRequest } from './axiosConfig';

// 取得縣市鄉鎮清單
export const getCountyList = async (param) => {
  const response = await userAxios
    .post('/api/setting/queryCounty', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 取得 OTP 及 MOTP 開通狀態
export const getMotpStatus = (params) => (
  userRequest('post', '/api/setting/motp/status', params)
);

/**
 * 發送 OTP 驗證碼
 * @param {*} otpMode: OTP模式(11/12/21/22)，十位數：1＝MBGW,2=APPGW、個位數：1=發送至非約轉門號, 2=發送至CIF門號
 * @returns {
 *   transId: OTP簡訊中的識別碼。
 * }
 */
export const sendOtpCode = (otpMode) => (
  userRequest('post', '/api/sendOtp', otpMode)
);
