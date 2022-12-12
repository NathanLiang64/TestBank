import uuid from 'react-uuid';
import { getSubSummary, getSubPayment, getSubPaymentHistory } from './api';

const handleSubPaymentHistory = async (account, subNo) => {
  /* 取得查詢起始日 */
  const startDate = async (param) => {
    const subPaymentList = await getSubPayment(param);

    return subPaymentList[0].startDate;
  };

  /* 取得查詢結束日，查詢區間為三年 */
  const endDate = async (param) => {
    const subPaymentList = await getSubPayment(param);
    return (parseInt(subPaymentList[0].startDate, 10) + 30000).toString();
  };

  /* 根據貸款帳號、貸款分號、起始日、結束日取得分帳還款記錄 */
  const resSubPaymentSummary = await getSubPaymentHistory({
    account,
    subNo,
    startDate: await startDate({ account, subNo }),
    endDate: await endDate({ account, subNo }),
  });
  let paymentSummaryData;

  if (resSubPaymentSummary.code === 'ISG0308-E494') paymentSummaryData = [];
  if (resSubPaymentSummary.code === '0000') paymentSummaryData = resSubPaymentSummary.data;

  return paymentSummaryData;
};

/**
 * 貸款首頁 - 取得貸款資訊和還款紀錄
   @returns [
   {
     type: 貸款別名
     accountNo: 卡號
     loanNo: 貸款分號
     balance: 貸款餘額
     currency: 幣別 // 無回傳資料，預設"NTD"
     bonusInfo: {
       cycleTiming: 每期還款日，回傳數字1~28
       interest: 應繳本息
       rewards: 可能回饋，未參加回饋挑戰可忽略
       isJoinedRewardProgram: 是否參加回饋挑戰
       currency: 幣別 // 無回傳資料，預設"NTD"
     },
     transactions: [
       {
         id: TODO 跳轉單筆繳款紀錄查詢頁需要
         txnDate: 交易日期
         amount: 還款金額
         balance: 貸款餘額
         currency: 幣別 // 無回傳資料，預設"NTD"
       }, ...],
    }, ...]
 */
export const getLoanSummary = async () => {
  /* 取得此帳號所有貸款資料 */
  const resSubSummary = await getSubSummary();

  /* 將回傳資料轉換成頁面資料結構 */
  const loanSummary = await Promise.all(resSubSummary.map(async (subSummary) => ({
    loanType: '信貸', // TODO: 貸款種類主機尚未提供，先暫填『信貸』
    accountNo: subSummary.account,
    loanNo: subSummary.subNo,
    balance: parseFloat(subSummary.balance),
    bonusInfo: {
      cycleTiming: subSummary.dayToPay,
      interest: parseFloat(subSummary.payAmount),
      rewards: '-', // TODO: 此階段不做
      isJoinedRewardProgram: '-', // TODO: 此階段不做
      currency: 'NTD',
    },
    transactions: await handleSubPaymentHistory(subSummary.account, subSummary.subNo)?.then((res) => res.map((subPaymentHistory) => ({
      id: uuid(),
      type: subPaymentHistory.type,
      txnDate: subPaymentHistory.date,
      amount: parseFloat(subPaymentHistory.amount),
      balance: parseFloat(subPaymentHistory.balance),
    }))),
  })));

  return loanSummary;
};
