import { callAPI } from 'utilities/axios';

/**
 * 查詢已申請分期資料
 *
 * @return {Promise<{
 *    newInstRestraintFlag: '分期約定書註記(新)'
 *    items:{ applType: '分期方案' }[]
 *  }>}
 */
export const queryInstallment = async (request) => {
  const response = await callAPI('/creditCard/installment/query', request);
  return response.data;
};

/**
 * 設定分期
 *
 * @param {[{
 *   applType: '分期方案 G: 單筆 , H: 總額'
 *   purchDate: '消費日期 yyyyMMdd'
 *   purchAmount: '消費金額'
 *   authCode: '授權號碼'
 *   totTerm: '總期數'
 * }]} request
 */
export const updateInstallment = async (request) => {
  const response = await callAPI('/creditCard/installment/update', request);
  return response;
};

/**
 * 設定分期約定書註記
 *
 * @param {{
 *   instRestraintFlagNew: '分期約定書註記(新) "B"或空白 空白時不異動分期約定書註記(新)'
 * }} request
 */
export const setInstallmentFlag = async (request) => {
  const response = await callAPI('/creditCard/installment/setFlag', request);
  return response.data;
};

/**
 * 查詢分期總約定書註記
 *
 * @returns {Promise<{
 *   newInstRestraintFlag, // 分期約定書註記(新)
 * }>}
 */
export const getInstallmentFlag = async (request) => {
  const response = await callAPI('/creditCard/installment/getFlag', request);
  return response.data;
};

/**
 * 查詢指定交易的明細
 *
 * @param {String} request  // 序號
 * @returns {Promise<{
 *   purchDate, // 消費日期
 *   purchAmount, // 消費金額
 *   authCode, // 授權號碼
 *   storeName, // 商店名稱
 * }>}
 */
export const getTxnDtl = async (request) => {
  const response = await callAPI('/creditCard/installment/getAvailTxnDtl', request);
  return response.data;
};

/**
 * 查詢可做分期的交易 (已篩選掉已申請分期的項目)
 *
 * @returns {Promise<{
 *   purchDate, // 消費日期
 *   purchAmount, // 消費金額
 *   authCode, // 授權號碼
 *   storeName, // 商店名稱
 * }[]>}
 */
export const getTxn = async (request) => {
  const response = await callAPI('/creditCard/installment/getAvailTxn', request);
  return response.data;
};

/**
 * 分期付款試算
 *
 * @param {[{
 *  purchDate:String,    // 消費日期 yyyyMMdd
 *  purchAmount:Number,  // 消費金額
 *  authCode:String,     // 授權號碼
 *  totTerm:Number,      // 總期數
 * }]} request  // 序號
 *
 * @returns {Promise<{
 *   amountFirst,
 *   amountStages,
 *   interestFirst,
 *   interestStages,
 * }>}
 *
 * amountFirst, amountStages, interestFirst, interestStages,
 */
export const getPreCalc = async (request) => {
  const response = await callAPI('/creditCard/installment/preCalc', request);
  return response.data;
};
