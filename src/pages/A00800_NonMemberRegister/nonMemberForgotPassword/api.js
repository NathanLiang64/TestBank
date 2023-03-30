/**
 * 取得otp資訊
 * @param {{phoneNumber: string}} param
 * @returns {{
 * otpCode: string
 * otpId: string
 * }}
 */
export const getOtp = (param) => {
  console.log('getOtp', {param});

  const response = {
    code: '0000',
    data: {
      otpCode: '112233',
      otpId: '112233',
    },
    message: '',
  }; // DEBUG mock data

  return response.data;
};

/**
 * 送出新密碼
 * @param {{password: string}} param
 * @returns boolean
 */
export const resetPassword = (param) => {
  console.log('resetPassword', {param});

  const response = {
    code: '0000',
    data: true,
    message: '',
  }; // DEBUG mock data

  return response.data;
};
