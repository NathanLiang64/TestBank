import { callAPI } from 'utilities/axios';

/**
 * 個人基本資料查詢
 * @returns {Promise<{
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
 *    emailVerifyToken: E-Mail驗證紀錄的Token (理專21誡)
 *    zipCode:  郵遞區號
 *    city:   縣市
 *    counuty:     鄉鎮市區
 *    addr:     地址
 * }} cifData
* @returns {Promise<{ isSuccess, code, message }>} 更新成功與否的旗標。
 */
export const updateProfile = async (cifData) => {
  const response = await callAPI('/personal/v1/updateProfile', { mode: 2, ...cifData });
  return response;
};

/**
 * 檢查輸入的E-Mail是否需要進行驗證。
 * @param {String} email 要進行驗證的電子郵件地址。
 * @returns {Promise<{
 *   status: Number,
 *   relations: [{id: String, name: String}],
 * }>}
 *- status: 驗證狀態：0=已驗證過, 1=立即驗證, 2=選擇理由, 3=無法使用, 9=驗證信已發送，但申請人尚未驗證；或是驗證信件在發送中
 *- relations: 若status=2時，則需要指定與此相同E-Mail用戶的關係。
 */
export const verifyMail = async (email) => {
  const response = await callAPI('/service/email/v1/verify', { email });
  return response.data;
};

/**
 * 發送驗證信。
 * @param {String} email 要進行驗證的電子郵件地址。
 * @returns {Promise<String>} E-Mail驗證紀錄的Token
 */
export const sendConfirmMail = async (email) => {
  const response = await callAPI('/service/email/v1/sendConfirm', { email });
  return response.data;
};

/**
 * 檢查是否已通過驗證信確認，以及保存設定的用戶關係。
 * @param {String} verifyToken E-Mail驗證紀錄的Token
 * @param {[{
 *   id: String,
 *   relation: Number, // 1.親屬關係, 2.朋友
 * }]} relations 與相同E-Mail用戶的關係。
 * @returns {Promise<{
 *   status: Number,
 *   relations: [{id: String, name: String}],
 * }>}
 *- status: 驗證狀態：0=已驗證過, 1=立即驗證, 2=選擇理由, 3=無法使用, 9=驗證信已發送，但申請人尚未驗證；或是驗證信件在發送中
 *- relations: 若status=2時，則需要指定與此相同E-Mail用戶的關係。
 */
export const updateVerifyRecord = async (verifyToken, relations) => {
  const response = await callAPI('/service/email/v1/updateRecord', { verifyToken, relations });
  return response.data;
};
