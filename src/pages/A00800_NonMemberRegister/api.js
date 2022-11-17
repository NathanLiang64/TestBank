/* eslint-disable no-unused-vars */
import { callAPI } from 'utilities/axios';

/**
 *
 * @return {
 *      uuidToken
 * }
 * @throws Exception
 */
export const getKey = async (param) => {
  // url: /app/getKey
  const result = {code: '0000'};
  return result;
};

/**
 * otp 驗證
 * 驗證失敗
 *
 * @param rq {
 *      uuidToken
 *      otpId // 表示本次發送OTP的 唯一識別碼。
 *      otpCode // 使用者輸入的驗證碼。
 *      channel // 1.MBGW, 2.APPGW , 不用給,沒給值預設 1
 * }
 * @return {
 *      result // true or false
 *      code
 *      message // 簡訊OTP驗證失敗，請重新進行xxxxx或致電客服。
 * }
 * @throws Exception
 */
export const chekOtp = async (param) => {
  const result = {code: '0000'};
  return result;
};

/**
 * 取得otp
 *
 * @param rq {
 *      mobile
 *      actionType // REGISTER: 1 , INVITE: 2 , FORGET_PW: 3 , TRANSFER: 4
 *      uuidToken //
 *      channel // 1.MBGW, 2.APPGW , 不用給預設 1
 * }
 * @return {
 *      otpId // otp識別碼
 * }
 * @throws Exception
 */
export const getOtp = async (param) => {
  // url: /app/getOtp
  const result = {code: '0000'};
  return result;
};

/**
 * 訪客註冊
 * path: /app/
 * @param rq {
 *      passwd // 密碼
 *      name // 戶名
 *      email // 信箱
 *      nickname // 暱稱
 *      deviceName // 裝置名稱
 *      osVersion // 裝置版本
 *      push // example: push:4f3fed88-7df3-44f1-82ee-0a964684a81b
 *      mudid // 隨機亂數 , example: mudid:fd82c80c3ab148a9a4c0321bce2793dc
 *      token // 對應前端 uuidtoken
 * }
 * @return {
 *      accessToken
 *      memberId
 * }
 */
export const memberRegisterApi = async (param) => {
  // url: /app/memberRegister
  const result = {code: '0000'};
  return result;
};

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
