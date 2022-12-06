// Formatter

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
