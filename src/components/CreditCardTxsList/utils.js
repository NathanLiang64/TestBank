// Formatter

import { dateToYMD } from 'utilities/Generator';
import { getTransactions } from './api';

// 將日期格式由 YYYYMMDD 字串轉為 MM/DD 字串
export const stringDateFormat = (stringDate) => {
  if (stringDate) return `${stringDate.slice(4, 6)}/${stringDate.slice(6, 8)}`;
  return '';
};
// 信用卡號顯示後四碼
export const creditNumberFormat = (stringCredit) => {
  if (stringCredit) return `${stringCredit.slice(-4)}`;
  return '';
};

export const getTransactionPromise = (cardNo) => new Promise((resolve) => {
  const today = new Date();
  const dateEnd = dateToYMD();
  // 查詢當天至60天前的資料
  const dateBeg = dateToYMD(
    new Date(today.setMonth(today.getMonth() - 2)),
  );
  getTransactions({
    cardNo,
    dateBeg,
    dateEnd,
  }).then((transactions) => {
    if (!transactions.length) resolve([]);
    else {
      const newTransactions = transactions.map((transaction) => ({...transaction, cardNo}));
      resolve(newTransactions);
    }
  });
});
