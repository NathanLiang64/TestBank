import { callAPI } from 'utilities/axios';

/**
 * 優惠利率額度 - 取得優惠利率年月
 * @param {token} params 不需傳入
 * @returns {[
 *  "YYYYMM"
 * ]} 年月字串陣列
 */
export const getBonusPeriodList = async (params) => {
  const response = await callAPI('/api/depositPlus/getDepBonusPeriodList', params);
  return response.data;
};

/**
 * 優惠利率額度 - 取得優惠利率年月 (優惠利率額度等級表)
 * @param {year} year string (e.g., '2022')
 * @returns {[
 *  {
 *    range: 等級,
 *    offlineDepositRange: 社群圈存款月平均餘額之總額,
 *    plus: 推薦人個人優惠利率存款額度,
 *  },
 * ]} response.data
 */
export const getDepositPlusLevelList = async (params) => {
  const response = await callAPI('/api/depositPlus/getDepPlusByYear', params);
  return response.data;
};

/**
 * 優惠利率額度 - 取得優惠利率明細 (該月份優惠利率)
 * @param {dateRange} params "YYYYMM"
 * @returns {{
 *  memberNo: string,
 *  period: "YYYYMM",
 *  summaryBonusQuota: 優惠利率額度總計,
 *  summaryRate: string,
 *  bonusDetail: [
 *    rate: string,
 *    bonusQuota: 優惠定額上限,
 *    promotionType: string,
 *    startDate: string | null,
 *    endDate: string | null,
 *    promotionName: 活動名稱,
 *    memo: 活動說明,
 *    brief: 各項活動說明之說明,
 *  ]
 * }} response.data
 */
export const getDepositPlus = async (params) => {
  const response = await callAPI('/api/depositPlus/getDepositPlus', params);
  return response.data;
};
