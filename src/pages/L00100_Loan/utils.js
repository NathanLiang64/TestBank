import { dateToYMD } from 'utilities/Generator';
import { getSubPaymentHistory } from './api';

export const handleSubPaymentHistory = async (account, subNo) => {
  /* 根據貸款帳號、貸款分號、起始日、結束日取得分帳還款記錄 */
  const resSubPaymentSummary = await getSubPaymentHistory({
    account,
    subNo,
    startDate: dateToYMD(new Date(new Date().setDate(new Date().getDate() - 30))),
    endDate: dateToYMD(),
  });
  let paymentSummaryData = [];

  if (resSubPaymentSummary.code === '0000') paymentSummaryData = resSubPaymentSummary.data;

  return paymentSummaryData;
};
