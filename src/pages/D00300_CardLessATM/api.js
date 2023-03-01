import { callAPI } from 'utilities/axios';

/**
 * 檢查無卡提款狀態
 * @returns {Promisr<Number>} 無卡提款狀態。 0-未申請 1-已申請未開通 2-已開通 3-已註銷 4-已失效 5-其他
 */
export const getCardlessWdStatus = async () => {
  const response = await callAPI('/deposit/withdraw/getStatus');
  return response.data;
};

/**
 * 建立無卡提款交易，並取得提款(交易)序號。
 * @param {String} account 提款帳號
 * @param {Number} amount 提款金額
 * @returns {Promise<{
 *   withdrawNo: String, // 提款序號(一次性)
 *   startTime: String, // 產生序號時間, 格式：'YYYYMMDD hhmmss'
 *   endTime: String, // 序號失效時間, 格式：'YYYYMMDD hhmmss'
 * }>}
 */
export const createCardlessWD = async (account, amount) => {
  const response = await callAPI('/deposit/withdraw/cardless/create', { account, withdrawAmount: amount });
  return response;
};

/**
 * 查詢金融卡的卡況
 *
 * @param token
 * @return {Promise<{
 *    status:       卡片狀態 1.新申請, 2.製卡 , 4.啟用, 5.掛失, 6.註銷, 7.銷戶, 8.臨時掛失, 9.整批申請
 *    statusDesc:   狀態描述 (1, 9) '申請中', (2) '尚未開卡', (4) '已啟用', (5) '已掛失', (6) '已註銷', (7) '已銷戶', (8) '已暫掛'
 *    addrCity:     通訊地址(縣市)    g0101.ADR2-CT
 *    addrDistrict: 通訊地址(區)      g0101.ADR2-AR
 *    addrStreet:   通訊地址(街道路)   g0101.ADR2-RD
 *    account:      臺幣數存母帳號
 * }>}
 *
 */
export const getStatus = async (params) => {
  const response = await callAPI('/deposit/withdraw/card/v1/getStatus', params);
  return response.data;
};
