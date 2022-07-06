// Get this month in YYYYMM order, '202206'
export const getThisMonth = (date = new Date()) => {
  const year = date.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'UTC' });
  const month = date.toLocaleDateString('en-US', { month: '2-digit', timeZone: 'UTC' });
  return `${year}${month}`;
};

// Generate array of current and pass 6-monthes in descending order:
// example: ['202206', '202205', '202204', ...]
export const getMonthList = (fromDate = new Date()) => {
  const list = [];
  const date = new Date(fromDate);
  for (let i = 0; i < 6; i++) {
    const year = date.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'UTC' });
    const month = date.toLocaleDateString('en-US', { month: '2-digit', timeZone: 'UTC' });
    list.push(`${year}${month}`);
    date.setMonth(date.getMonth() - 1);
  }
  return list;
};
