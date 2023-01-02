import { callAPI } from 'utilities/axios';

/**
 * 個人基本資料查詢
 * @returns {Promist<{
 *    custName, // 中文姓名
 *    mobile, // 手機
 *    email, // 電子郵件
 *    birthday, // 生日
 *    zipCode, // 郵遞區號
 *    county, // 寄送地址 - 城市
 *    city, //寄送地址 - 地區
 *    addr, //寄送地址 - 道路
 *    userData, //年收入,職稱,行業
 * }>}
 */
export const getProfile = async () => {
  const response = await callAPI('/api/setting/v1/getProfile');
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

/**
 * 金融卡掛失
 * 條件: 卡況 需要 2製卡 4已啟用 8臨時掛失中 這三種時，才可以掛失
 *
 * @param token
 * @return {
 *      result:   true/false
 *      message:  訊息
 * }
 */
export const reIssueOrLost = async (params) => {
  const response = await callAPI('/api/debit/card/v1/reIssueOrLost', params);
  return response.data;
};
