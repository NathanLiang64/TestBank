import { callAPI } from 'utilities/axios';

/**
 * 優惠利率額度 - 取得優惠利率年月
 * @returns {Promise<[
*  String
 * ]>} 年月字串陣列
 */
export const getBonusPeriodList = async () => {
  const response = await callAPI('/community/bonus/v1/getPeriodList');
  return response.data;
};

/**
 * 優惠利率額度 - 取得優惠利率年月 (優惠利率額度等級表)
 * @param {String} yearly 要查詢的年度。(e.g., '2022')
 * @returns {Promise<[{
 *    level: Number,
 *    baseAmount: Number
 *    maxAmount: Number
 *    quota: Number,
 *  }]>}
 * - level: 優存等級
 * - baseAmount: 目前等級之總額「最低」社群圈存款月平均餘額
 * - maxAmount: 目前等級之總額「最高」社群圈存款月平均餘額
 * - quota: 優惠利率存款額度
 */
export const getDepositPlusLevelList = async (yearly) => {
  const response = await callAPI('/community/bonus/v1/getLevelSpec', yearly);
  return response.data;
};

/**
 * 優惠利率額度 - 取得優惠利率明細 (該月份優惠利率)
 * @param {String} period 期別，即：年月，例：202201
 * @returns {Promise<{
 *  memberNo: string,
 *  period: String,
 *  summaryBonusQuota: 優惠利率額度總計,
 *  summaryRate: string,
 *  bonusDetail: [{
 *    rate: string,
 *    bonusQuota: 優惠定額上限,
 *    promotionType: string,
 *    startDate: string | null,
 *    endDate: string | null,
 *    promotionName: 活動名稱,
 *    memo: 活動說明,
 *    brief: 各項活動說明之說明,
 *    briefLink: 各項活動說明連結及文字,
 *  }]
 * }>} response.data
 */
export const getEligibleItems = async (period) => {
  const response = await callAPI('/community/bonus/v1/getEligibleItems', period);
  return response.data;
};
