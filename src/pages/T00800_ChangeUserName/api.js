import { callAPI } from 'utilities/axios';

/**
 * 變更使用者代號
 * @param {{
 *   userName, // 舊使用者代號
 *   newUserName, // 新使用者代號
 * }} request
 * @returns {*}
 */
export const changeUserName = async (request) => {
  const response = await callAPI('/auth/v1/changeUserName', request);
  return response;
};
