import { callAPI } from 'utilities/axios';

/**
 * 查詢客戶的信用卡清單
 * (信用卡子首頁 - 1)
 * (信用卡子首頁_即時消費明細 - 1)
 *
 * @param token
 * @return {
 * usedCardLimit, // 已使用額度
 * memberLevel, // 會員等級
 * rewardsRateDomestic, // 國內回饋
 * rewardsRateOverseas, // 國外回饋
 * rewardsAmount, // 回饋試算
 * cards [
 *      {
 *        cardNo, // 卡號
 *        isBankeeCard, // 專案代號
 *      },
 *      ...
 *    ]
 * }
 *
 */

export const getBankeeCard = async (request) => {
  const {
    data: { cards, usedCardLimit },
  } = await callAPI('/api/card/v1/getCards', request);
  const {cardNo, isBankeeCard} = cards.find((card) => card.isBankeeCard === 'Y');
  return { cards: [{ cardNo }], usedCardLimit, isBankeeCard: isBankeeCard === 'Y' };
};
