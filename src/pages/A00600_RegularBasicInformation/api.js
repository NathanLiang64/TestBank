import { callAPI } from 'utilities/axios';

/**
 * 取得CIF資料。
 * @returns {Promise<{
 *   jobCode,
 *   grade,
 *   income,
 * }>}
 */
export const getCifData = async () => {
  const response = await callAPI('/personal/v1/getCifData', 'A');
  return response.data;
};

// 更新定期基本資料
export const updateRegularBasicInformation = async (param) => {
  const response = await callAPI('/api/setting/custMdfyJob', param);
  return response.data;
};
