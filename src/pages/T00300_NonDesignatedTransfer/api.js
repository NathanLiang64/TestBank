import { callAPI } from 'utilities/axios';

/**
 * 查詢非約轉設定狀態與綁定的手機號碼。
 * @returns {Promise<{
 *   status: Number,
 *   mobile: String,
 * }>}
 * - status: 非約轉設定狀態：0.未申請, 1.已申請未開通, 2.密碼逾期30日, 3.已開通, 4.已註銷, 5.OTP啟用密碼錯誤鎖定, 6.OTP交易密碼錯誤鎖定, 7.其他
 * - mobile: 預設為非約轉OTP門號；若尚未設有非約轉OTP門號時，則傳回CIF門號。
 */
export const getSettingInfo = async () => {
  const response = await callAPI('/deposit/transfer/nonAgreed/v1/getSettingInfo');
  return response.data;
};

/**
 * 綁更綁定狀態。
 * @param {String} mobile 新的綁定手機號碼；若未指定表示取消綁定。
 * @returns {Promise<Integer>} status: 非約轉設定狀態
 */
export const changeStatus = async (mobile) => {
  const response = await callAPI('/deposit/transfer/nonAgreed/v1/changeStatus', mobile);
  return response.data;
};
