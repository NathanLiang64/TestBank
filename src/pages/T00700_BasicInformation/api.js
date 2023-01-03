import { callAPI } from 'utilities/axios';

/**
 * 個人基本資料查詢
 * @param token
 * @return {
 *    custName   中文姓名
 *    mobile     手機
 *    email      電子郵件
 *    birthday   生日
 *    zipCode    郵遞區號
 *    county     寄送地址 - 城市
 *    city       寄送地址 - 地區
 *    addr       寄送地址 - 道路
 *    userData   年收入,職稱,行業
 * }
 * @throws Exception
 */
export const getBasicInformation = async (param) => {
  const response = await callAPI('/api/setting/custQuery', param);
  return response.data;
};

/**
 * 個人基本資料變更
 *
 * @param JwtToken
 * @param CustMdfyRq{
 *    mobile:   手機
 *    email:    email
 *    zipCode:  郵遞區號
 *    county:   縣市
 *    city:     鄉鎮市區
 *    addr:     地址
 *    actionCode: 0 未變更 / 1 通訊地址變更 / 2 手機號碼變更 / 4 電子郵件變更 / 7 代表三個欄位都有變更 (Integer)
 * }
 * @return {
 *    code: "0000",
 *    rootCode: null,
 *    message: "Success!!"
 * }
 * @throws Exception
 */
export const modifyBasicInformation = async (param) => {
  const response = await callAPI('/api/setting/custModify', param);
  return response;
};
