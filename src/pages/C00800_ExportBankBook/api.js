import { callAPI } from 'utilities/axios';

/**
 * 以E-Mail寄送數位存摺
 * @param {Boolean} coverOnly 表示僅匯出存簿封面
 * @param {{
 *   accountNo: String,
 *   startDate: String, // yyyyMMdd
 *   endDate: String, // yyyyMMdd
 *   fileType: Number // 1 -> Pdf , 2 -> xlsx
 * }} conditions
 * @returns {Promise<Boolean>} 表示 E-Mail 發送成功與否的旗標。
 */
export const sendBankbook = async (coverOnly, conditions) => {
  const request = {
    contentType: (coverOnly ? 1 : 3), // 檔案內容(1.封面、3.完整,包含封面及交易明細)
    ...conditions,
    fileType: 1,
  };
  const response = await callAPI('/deposit/account/v1/sendBankbook', request);
  return response.data;
};

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
