import { callAPI } from 'utilities/axios';

/**
 * 網銀密碼變更
 * @param {{
 *   password, // 舊網銀密碼
 *   newPassword, // 新網銀密碼
 * }} request
 * @returns
 */
export const changePwd = async (request) => {
  const response = await callAPI('/auth/v1/changePassword', request);
  return response.data;
};
