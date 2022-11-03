/* eslint-disable no-unused-vars */
import { transactionAuth } from 'utilities/AppScriptProxy';
import { callAPI } from 'utilities/axios';

/**
 * OTP驗證
 * @param {{
 * phoneNumber: string,
 * }} phoneNumber 所輸入之電話號碼
 * @returns {{
 * result: boolean,
 * }} 驗證結果
 */
export const getOtp = async (phoneNumber) => {
  console.log('A00800 api getOtp - phoneNumber: ', phoneNumber);
  // const authCode = '0x2B'; // OTP?
  // const result = await transactionAuth(authCode, phoneNumber);
  const result = {result: true};

  return result;
};

export const memberRegister = async (data) => {
  console.log('A00800 api memberRegister - data: ', data);
  const {name, email, passwd} = data;

  const result = {code: '0000'};
  return result;
};
