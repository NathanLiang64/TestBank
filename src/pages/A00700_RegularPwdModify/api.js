import { callAPI } from 'utilities/axios';

/**
 * 定期更新網銀密碼
 * @param {{
 *   password, // 舊網銀密碼
 *   newPassword, // 新網銀密碼
 * }} request 若二個欄位均為 null 表示不變更。
 * @returns
 */
export const renewPwd = async (request) => {
  const response = await callAPI('/auth/v1/renewPassword', request);
  return response.data;
};
