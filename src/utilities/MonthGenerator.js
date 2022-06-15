// Get this month in YYYYMM order, '202206'
export const getThisMonth = (date = new Date()) => {
  const tmp = date.toLocaleDateString('UTC', { year: 'numeric', month: '2-digit' }).split('/');
  return `${tmp[1]}${tmp[0]}`;
};

// Generate array of current and pass 6-monthes in descending order:
// example: ['202206', '202205', '202204', ...]
export const getMonthList = (fromDate = new Date()) => {
  const list = [];
  const date = new Date(fromDate);
  for (let i = 0; i < 6; i++) {
    const tmp = date.toLocaleDateString('UTC', { year: 'numeric', month: '2-digit' }).split('/');
    list.push(`${tmp[1]}${tmp[0]}`);
    date.setMonth(date.getMonth() - 1);
  }
  return list;
};
