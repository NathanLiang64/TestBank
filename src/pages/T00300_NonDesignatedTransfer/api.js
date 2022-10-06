/* eslint-disable no-unused-vars */
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
  const result = param;
  return result;
};
