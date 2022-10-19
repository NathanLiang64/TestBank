/* eslint-disable no-use-before-define */
/* eslint-disable no-nested-ternary */
import { getQLStatus } from 'utilities/AppScriptProxy';
import { callAPI } from 'utilities/axios';

/**
 * 取得用戶非約轉設定初始資料
 * @param token
 * @returns {{
 *  status: 非約轉狀態,
 *  mobile: 裝置門號,
 * }}
 * status: 00-未申請、01-已申請未開通、02-密碼逾期30日、03-已開通、04-已註銷、05-OTP啟用密碼錯誤鎖定、06-OTP交易密碼錯誤鎖定、07-其他
 * mobile: 預設OTP號碼，如果沒有就帶入通訊門號
 */
export const getNonDesignatedTransferData = async () => {
  const result = await queryOTP();
  const custData = await callAPI('/api/setting/custQuery');

  const sysMobile = custData.data.mobile;

  if (result.data.mobile === null) {
    result.data.mobile = sysMobile;
  }

  return result.data;
};

/**
 * 確認裝置綁定狀態
 * @param {token} token
 * @returns {{
 *  bindingStatus: 裝置是否正常綁定,
 *  failureCode: 綁定失敗代碼,
 *  message: 失敗訊息,
 * }}
 * bindingStatus: boolean,
 * failureCode: '1_0'-未綁定、'1_1'-以綁定其他帳號或裝置、'6'-其他錯誤（系統錯誤）、''-正常綁定
 */
export const checkDeviceBindingStatus = async () => {
  const {
    result,
    message,
    QLStatus,
  } = await getQLStatus();

  // 回傳成功
  if (result === 'true') {
    // 未綁定
    if (QLStatus === '0') {
      return {bindingStatus: false, failureCode: '1_0', message: ''};
    }
    // 已綁定帳號或裝置
    if (QLStatus === '3' || QLStatus === '4') {
      return {bindingStatus: false, failureCode: '1_1', message: ''};
    }
    return {result, QLStatus};
  }

  // 回傳失敗
  console.log('T00300 checkDeviceBindingStatus: ', { result, message});
  return {bindingStatus: result, failureCode: '6', message};
};

/**
 * [測試]MID驗證
 * @param {}
 * @returns {
 * result: boolean    驗證通過 | 驗證不通過/系統錯誤
 * msg: ''            系統錯誤訊息
 * }
 */
export const MIDVerify = async () => {
  const result = {result: true, msg: ''};

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
 *    status: 申請狀態 (01:申請,  02:註銷 , 03:密碼重製 , 04:變更手機號碼)
 *    mobile: 手機號碼
 * }
 * @return {
 *    code:   0000 表示成功
 *    message: 訊息類別
 * }
 */
export const updateOTP = async (request) => {
  const response = await callAPI('/api/transfer/debit/v1/updateOTP', request);
  return response;
};
