import { callAPI } from 'utilities/axios';

/**
 * 查詢客戶信用卡帳單資訊
 *
 * @author danny
 * @Date 2022/09/27
 * @param token
 * @param period 期別 (ex: 202212)
 * }
 * @return {
 *    newBalance,
 *    details [
 *      {
 *        txDate,   交易日期時間 (yyyymmddhhmmss)
 *        cardNo,   卡號
 *        desc,     消費項目說明
 *        amount,   消費金額
 *      },
 *      ...
 *    ]
 * }
 */
export const queryCardBill = async (request) => {
  const response = await callAPI('/api/card/v1/getBillSummary', request);
  return response.data;
};
