import { getCallerFunc } from 'utilities/AppScriptProxy';
import { callAPI } from 'utilities/axios';
import { dateToString } from 'utilities/Generator';

/**
 * 取得取得免費跨提/跨轉次數、數存優惠利率及資訊
 * @param {String} accountNo 存款帳號
 * @returns {Promise<
  {
    freeWithdraw: 免費跨提總次數
    freeWithdrawRemain: 免費跨提剩餘次數
    freeTransfer: 免費跨轉總次數
    freeTransferRemain: 免費跨轉剩餘次數
    bonusQuota: 優惠利率額度
    bonusRate: 優惠利率
    interest: 累積利息
  }>} 優惠資訊
 */
export const getAccountExtraInfo = async (accountNo) => {
  const response = await callAPI('/api/depositPlus/v1/getBonusInfo', accountNo);
  return response.data;
};

/**
 * 建立台幣轉帳交易，需再完成交易確認才會真的執行轉帳。
 * @param {{
      transOut: 轉出帳號
      transIn: {
        bank: 轉入帳戶的銀行
        account: 轉入帳戶的帳號
      }
      amount: 轉出金額
      booking: {
        mode: 立即或預約 // 0.立即轉帳, 1.預約轉帳
        multiTimes: 單次或多次 // 單次, *.多次
        transDate: 轉帳日期 // multiTimes='1'時
        transRange: 轉帳日期區間 // multiTimes='*'時
        cycleMode: 交易頻率 // 1.每周, 2.每月
        cycleTiming: 交易週期 // 〔 0~6: 周日~周六 〕或〔 1~31: 每月1~31〕, 月底(29/30/31)會加警示。
      }
      memo: 備註
    }} request
 * @returns {*}
 */
export const createNtdTransfer = async (request) => {
  const response = await callAPI('/api/transfer/ntd/v1/create', {
    ...request,
    callerFunc: getCallerFunc(), // 啟用轉帳功能的 FuncCode, 例: 從台幣首頁叫轉帳時，應傳入C00300
  });
  return response.data;
};

/**
 * 執行轉帳交易。
 * @returns {Promise<{
      isSuccess,
      balance: 轉出後餘額,
      fee: 手續費,
      errorCode,
      message,
      // TODO payDate, SERVER交易序號, 交易識別碼
   }>} 轉帳結果。
 */
export const executeNtdTransfer = async () => {
  const response = await callAPI('/api/transfer/ntd/v1/execute');
  return response.data;
};

/**
 * 將轉帳金額加標千分位符號及前置'$'.
 */
export const getDisplayAmount = (amount) => `$${new Intl.NumberFormat('en-US').format(amount)}`;

/**
 * 產生轉帳發生時間或區間的描述訊息。
 */
export const getTransDate = (model) => {
  const { booking } = model;

  if (!booking?.mode) return dateToString(new Date()); // 立即轉帳 用今天表示。

  const { multiTimes, transDate, transRange } = booking;
  if (multiTimes === '1') {
    return `${dateToString(transDate)}`;
  }
  return `${dateToString(transRange[0])} ~ ${dateToString(transRange[1])}`;
};

/**
 * 產生週期預約轉帳的描述訊息。
 */
export const getCycleDesc = (booking) => {
  const cycleWeekly = ['日', '一', '二', '三', '四', '五', '六'];
  const { cycleTiming } = booking;
  if (booking.cycleMode === 1) {
    return `每周${cycleWeekly[booking.cycleTiming]}`;
  }
  return `每個月${cycleTiming}號`;
};
