/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import { callAPI } from 'utilities/axios';
import { mockT00300Data } from './mockData/mockT00300Data';

/**
 * 取得用戶非約轉設定初始資料
 * @param token
 * @returns {
 *  originalStatus   0 | 1 | 2 (0已開通、1已註銷（未申請未開通）、2已申請未開通)
 *  mobile           "10 digits number" (裝置門號：預設OTP號碼，如果沒有就帶入通訊門號)
 *  QLStatus         true | false (裝置綁定狀態)(有綁定狀態確認方法後移除)
 * }
 */
export const getNonDesignatedTransferData = async () => {
  const statusNo = 6;
  const result = await mockT00300Data(statusNo);

  console.log('T00300 api getNonDesignatedTransferData() result: ', {statusNo, result});
  return result;
};

/**
 * 確認裝置綁定狀態
 * @param {QLStatus} param true | false
 * @returns {
 *  bindingStatus    true | false 裝置綁定狀態
 * }
 */
export const checkDeviceBindingStatus = async (param) => {
  console.log('T00300 api checkDeviceBindingStatus() param: ', param);
  const result = param;
  return result;
};

/**
 * [測試]雙因子驗證：
 * 未知是否包含在api中，api規格確認前使用此判斷製造情境
 * @param {param} param number: 1: 通過, 0: 不通過, 2: 系統錯誤
 * @returns number: 1: 通過, 0: 不通過, 2: 系統錯誤
 */
export const bifactorVerify = async (param) => {
  console.log('T00300 api bifactorVerify() param: ', param);
  const result = param === 0
    ? {code: 0, msg: ''} : param === 1
      ? {code: 1, msg: ''} : {code: 2, msg: 'Error 401'};

  return result;
};

/**
 * [測試]OTP驗證：
 * @param {otpCode} param number，OTP驗證碼
 * @returns {
 * code: 0 | 1 | 2    驗證不通過 | 驗證通過 | 系統錯誤
 * msg: ''            系統錯誤訊息
 * }
 */
export const OTPVerify = async (param) => {
  console.log('T00300 api OTPVerify() param: ', param);
  const result = {code: 1, msg: ''};

  return result;
};

/**
 * [測試]OTP驗證：
 * @param {}
 * @returns {
 * code: 0 | 1 | 2    驗證不通過 | 驗證通過 | 系統錯誤
 * msg: ''            系統錯誤訊息
 * }
 */
export const MIDVerify = async () => {
  const result = {code: 1, msg: ''};

  return result;
};

/**
 * 查詢非約轉設定狀態與非約轉手機號碼
 *
 * @param token
 * @return {
 *    status: 非約轉申請狀態 (0-未申請 , 1-已申請未開通 , 2-密碼逾期30日 , 3-已開通 , 4-已註銷 , 5-OTP啟用密碼錯誤鎖定 , 6-OTP交易密碼錯誤鎖定 , 7-其他)
 *    mobile: 手機號碼
 * }
 */
export const queryOTP = async (request) => {
  const response = await callAPI('/api/transfer/debit/v1/queryOTP', request);
  return response;
};

/**
 * 更新非約轉狀態或非約轉手機號碼
 *
 * @param token
 * @param rq {
 *    status: 申請狀態
 *    mobile: 手機號碼
 * }
 * @return {
 *    code:   0000 表示成功
 *    message: 訊息類別
 * }
 */
export const updateOTP = async (request) => {
  const response = await callAPI('/api/transfer/debit/v1/updateOTP"', request);
  return response;
};
