import { callAPI } from 'utilities/axios';

/**
 * 取得個人基本資料(CIF)
 * @returns {Promise<{
 *   jobCode,
 *   grade,
 *   income,
 * }>}
 */
export const getProfile = async () => {
  const response = await callAPI('/personal/v1/getProfile');
  return response.data;
};

/**
 * 更新定期基本資料
 * @param {{
 *   jobCode,
 *   grade,
 *   income,
 * }} cifData
* @returns {Promise<{ isSuccess, code, message }>} 更新成功與否的旗標。
 */
export const updateProfile = async (cifData) => {
  const response = await callAPI('/personal/v1/updateProfile', { mode: 1, ...cifData });
  return response;
};
