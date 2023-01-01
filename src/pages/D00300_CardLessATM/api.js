import { callAPI } from 'utilities/axios';

/**
 * 檢查無卡提款狀態
 * @returns {Promisr<String>} 無卡提款狀態。 0-未申請 1-已申請未開通 2-已開通 3-已註銷 4-已失效 5-其他
 */
export const getCardlessWdStatus = async () => {
  const response = await callAPI('/api/cardlessWD/getStatus');
  return response.data;
};

// 申請無卡提款 done
export const cardLessWithdrawApply = async (param) => {
  const response = await callAPI('/api/cardlessWD/withdrawal', param);
  return response.data;
};

/**
 * 開通無卡提款服務 測試時須請ken幫忙協助reset無卡提款狀態
 *
 * @param token
 * @return {
 *    message: 回傳訊息 例如: 'E660: 申請不准'
 *    chgPwMessage: 空白表示成功
 * }
 * @throws Exception
 */
export const cardLessWithdrawActivate = async (param) => {
  const response = await callAPI('/api/cardlessWD/activate', param);
  return response.data;
};

/**
 * 查詢金融卡的卡況
 *
 * @param token
 * @return {
 *    status:       卡片狀態 1.新申請, 2.製卡 , 4.啟用, 5.掛失, 6.註銷, 7.銷戶, 8.臨時掛失, 9.整批申請
 *    statusDesc:   狀態描述 (1, 9) '申請中', (2) '尚未開卡', (4) '已啟用', (5) '已掛失', (6) '已註銷', (7) '已銷戶', (8) '已暫掛'
 *    addrCity:     通訊地址(縣市)    g0101.ADR2-CT
 *    addrDistrict: 通訊地址(區)      g0101.ADR2-AR
 *    addrStreet:   通訊地址(街道路)   g0101.ADR2-RD
 *    account:      台幣數存母帳號
 * }
 * @throws Exception
 *
 */
export const getStatus = async (params) => {
  const response = await callAPI('/api/debit/card/v1/getStatus', params);
  return response.data;
};
