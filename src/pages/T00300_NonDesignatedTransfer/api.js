import { callAPI } from 'utilities/axios';

/**
 * 查詢非約轉設定狀態與綁定的手機號碼。
 * @returns {Promise<{
 *   status: 非約轉設定狀態,
 *   mobile: 綁定的手機號碼,
 * }>}
 * - status: 00.未申請, 01.已申請未開通, 02.密碼逾期30日, 03.已開通, 04.已註銷, 05.OTP啟用密碼錯誤鎖定, 06.OTP交易密碼錯誤鎖定, 07.其他
 * - mobile: 預設為非約轉OTP門號；若尚未設有非約轉OTP門號時，則傳回CIF門號。
 */
export const getSettingInfo = async () => {
  const response = await callAPI('/api/transfer/nonAgreed/v1/getSettingInfo');
  return response.data;
};

/**
 * 綁更綁定狀態。
 * @param {String} mobile 新的綁定手機號碼；若未指定表示取消綁定。
 * @returns {Promise<String>} status: 非約轉設定狀態
 */
export const changeStatus = async (mobile) => {
  const response = await callAPI('/api/transfer/nonAgreed/v1/changeStatus', mobile);
  return response.data;
};
