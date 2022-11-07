/* eslint-disable no-unused-vars */
import { callAPI } from 'utilities/axios';

/**
 * 訪客註冊資料送出
 * @param {{
 * name: string,
 * email: string,
 * passwd: string,
 * }} data 姓名、電子郵件、密碼
 * @returns {{
 * code: string,
 * message: string,
 * }} 成功 — code: '0000'
 */
export const memberRegister = async (data) => {
  console.log('A00800 api memberRegister - data: ', data);
  const {name, email, passwd} = data;
  // TODO: API

  const result = {code: '0000'};
  return result;
};
