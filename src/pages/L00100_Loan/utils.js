import { dateToYMD } from 'utilities/Generator';
import { getSubPaymentHistory } from './api';

export const handleSubPaymentHistory = async (account, subNo) => {
  /* 取得查詢起始日，查詢區間為三年 */
  const startDate = () => (parseInt(dateToYMD(), 10) - 30000).toString();

  /* 根據貸款帳號、貸款分號、起始日、結束日取得分帳還款記錄 */
  const resSubPaymentSummary = await getSubPaymentHistory({
    account,
    subNo,
    startDate: startDate(),
    endDate: dateToYMD(),
  });
  let paymentSummaryData = [];

  if (resSubPaymentSummary.code === '0000') paymentSummaryData = resSubPaymentSummary.data;

  return paymentSummaryData;
};
