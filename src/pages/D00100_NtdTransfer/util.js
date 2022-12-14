import { dateToString } from 'utilities/Generator';

/**
 * 取得本次轉帳的交易轉入帳號資訊。
 * @param {*} transIn
 * @returns {{ bankId, bankName, account, accountName }} 轉入帳號資訊。
 */
export const getTransInData = (transIn) => {
  const quickAcct = [null, transIn.freqAcct, transIn.regAcct][transIn.type]; // 常用(freqAcct)/約定(regAcct) 帳號
  const data = {
    bank: quickAcct?.bankId ?? transIn.bank,
    bankName: quickAcct?.bankName ?? transIn.bankName,
    account: quickAcct?.accountNo ?? transIn.account,
    accountName: quickAcct?.accountName, // 非常用或約定帳號 不會有別名。
  };
  return data;
};

/**
 * 將轉帳金額加標千分位符號及前置'$'.
 * @param {Number} amount 金額
 */
export const getDisplayAmount = (amount) => `$${new Intl.NumberFormat('en-US').format(amount)}`;

/**
 * 產生轉帳發生時間或區間的描述訊息。
 */
export const getTransDate = (booking) => {
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
