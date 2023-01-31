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
 *    isStar: 是否顯示星號, // TODO 確認正確key name
 *    memo: 活動說明,
 *    brief: 各項活動說明之說明,
 *    detailLinkText: 各項活動說明右方按鈕文字 // TODO 確認正確key name
 *    detailUrl: 各項活動說明外開網頁url (若不需外開則為空) // TODO 確認正確key name
 *  }]
 * }>} response.data
 */
// eslint-disable-next-line no-unused-vars
export const getDepositPlus = async (period) => {
  // const response = await callAPI('/community/bonus/v1/getEligibleItems', period);
  // return response.data;

  // DEBUG 以下為mock data，待後端調整完畢後將移除
  const data = {
    period: '202212',
    summaryBonusQuota: '50000',
    summaryRate: '0.026',
    bonusDetail: [
      {
        rate: '0.026',
        bonusQuota: '0',
        promotionType: 'A',
        startDate: null,
        endDate: null,
        promotionName: '社群圈優惠額度',
        isStar: true,
        memo: '依優惠額度等級',
        brief: [
          '適用優惠：社群圈存款月平均餘額之總額當月達到指定門檻，推薦人次月可享活存利率加碼優惠。',
          '備註：本專案優惠與標示*活動之優惠額度採擇優計算。',
        ],
        detailLinkText: '優惠額度等級表',
        detailUrl: '',
      },
      {
        rate: '0.026',
        bonusQuota: '50000',
        promotionType: 'A',
        startDate: '20221221',
        endDate: '20230620',
        promotionName: '2.6%通通有',
        isStar: true,
        memo: '適用活動優惠',
        brief: [
          '適用優惠：當月新增1個以上好友開戶成功，推薦人及被推薦人享6個月2.6%優存額度5萬。',
          '備註：本專案優惠與標示*活動之優惠額度採擇優計算。',
        ],
        detailLinkText: '活動詳情',
        detailUrl: 'https://www.bankee.com.tw/event/26Pa/index.html',
      },
    ],
  };

  return data;
};
