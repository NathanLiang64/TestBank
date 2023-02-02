/* eslint-disable no-unused-vars */
import { getEligibleItems } from './api';

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
*    detailLinkText: 各項活動說明右方按鈕文字,
*    detailUrl: 各項活動說明外開網頁url (若不需外開則為空),
*  }]
* }>} response.data
*/
export const getDepositPlus = async (month) => {
  const res = await getEligibleItems(month);

  const handleBriefLink = (htmlLink) => {
    // 取 <a> 的 href
    const detailUrl = htmlLink.match(/href="(.*?)"/g).toString().split('"')[1];

    // 取 <a></a> 中間的文字
    const detailLinkText = htmlLink.match(/">(.*?)<\/a>/g)[0].replace(/<\/?a>/g, '').replace(/">/g, '');

    return {detailUrl, detailLinkText};
  };

  const handleBrief = (htmlBrief) => {
    // 移除 "●"
    const modifiedBrief = htmlBrief.replaceAll('●', '');
    return modifiedBrief;
  };

  const modifiedRes = {
    ...res,
    bonusDetail: res.bonusDetail.map((detail) => ({
      ...detail,
      detailUrl: handleBriefLink(detail.briefLink).detailUrl,
      detailLinkText: handleBriefLink(detail.briefLink).detailLinkText,
      brief: handleBrief(detail.brief),
    })),
  };

  console.log('🅱️ DepositPlus utils getDepositPlus()', modifiedRes);
  return modifiedRes;
};
