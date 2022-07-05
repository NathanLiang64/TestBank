// import { callAPI } from 'utilities/axios';

import mockLoanSummary from './mockData/mockLoanSummary';
import mockLoanRewards from './mockData/mockRewards';
import mockLoanDetails from './mockData/mockLoanDetails';

/**
 * 貸款首頁 - 取得貸款資訊和還款紀錄
   @returns [
   {
     alias: 貸款別名
     accountNo: 卡號
     balance: 貸款餘額
     currency: 幣別
     bonusInfo: {
       cycleTiming: 每期還款日，回傳數字1~28
       interest: 應繳本息
       rewards: 可能回饋，未參加回饋挑戰可忽略
       isJoinedRewardProgram: 是否參加回饋挑戰
       currency: 幣別
     },
     transactions: [
       {
         id: TODO 跳轉單筆繳款紀錄查詢頁需要
         txnDate: 交易日期
         amount: 還款金額
         balance: 貸款餘額
         currency: 幣別
       }, ...],
    }, ...]
 */
export const getLoanSummary = async () => {
  // const response = await callAPI('/api/');
  const response = await new Promise((resolve) => resolve({ data: mockLoanSummary }));
  return response.data;
};

/**
 * 可能回饋 - 取得回饋紀錄
   @param {
     accountNo: 指定貸款帳號
     month: 指定月份，或null、undefined為最近的六個月
   }
   @returns {
     rewards: 可能回饋，未參加回饋挑戰可忽略
     isJoinedRewardProgram: 是否參加回饋挑戰
     currency: 幣別
     transactions: [
       {
         isSuccess: 挑戰成功或失敗
         txnDate: 交易日期
         amount: 利息金額，挑戰失敗可忽略
         rate: 利息（不含%），挑戰失敗可忽略
         currency: 幣別，挑戰失敗可忽略
       }, ...]
   }
 */
export const getLoanRewards = async (param) => {
  // const response = await callAPI('/api/');
  const response = await new Promise((resolve) => resolve({ data: mockLoanRewards(param) }));
  return response.data;
};

/**
 * 貸款資訊 - 取得貸款資訊
   @param {
     accountNo: 指定貸款帳號
   }
   @returns {
     alias: 貸款別名
     accountNo: 貸款帳號
     loanNo: 貸款分號
     loanType: 貸款類別
     startDate: 貸款開始日
     endDate: 貸款結束日
     cycleTiming: 每期還款日，回傳數字1~28
     loanAmount: 貸款金額
     rate: 貸款利率
     loanBalance: 貸款餘額
     periodPaid: 已繳期數
     periodRemain: 剩餘期數
     initialAmount: 最初撥貸金額
     currency: 幣別
   },
 */
export const getLoanDetails = async (param) => {
  // const response = await callAPI('/api/');
  const response = await new Promise((resolve) => resolve({ data: mockLoanDetails(param) }));
  return response.data;
};
