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
 * }>}
 */
export const getProfile = async () => {
  const response = await callAPI('/personal/v1/getProfile');
  return response.data;
};

/**
 * 個人基本資料變更
 * @param {{
 *    mobile:   手機
 *    email:    email
 *    zipCode:  郵遞區號
 *    county:   縣市
 *    city:     鄉鎮市區
 *    addr:     地址
 * }} cifData
* @returns {Promise<{ isSuccess, code, message }>} 更新成功與否的旗標。
 */
export const updateProfile = async (cifData) => {
  const response = await callAPI('/personal/v1/updateProfile', { mode: 2, ...cifData });
  return response;
};
