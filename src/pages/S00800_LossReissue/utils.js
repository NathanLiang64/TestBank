export const statusTextGenerator = (status) => {
  switch (status) {
    case '01':
      return '新申請';
    case '02':
      return '尚未開卡';
    case '04':
      return '已啟用';
    case '05':
      return '已掛失';
    case '06':
      return '已註銷';
    case '07':
      return '已銷戶';
    case '08':
      return '臨時掛失中';
    case '09':
      return '申請中';
    default:
      return '-';
  }
};

export const actionTextGenerator = (status) => {
  if (status === '02' || status === '04' || status === '08') return '掛失';
  if (status === '05' || status === '06') return '補發';
  return '';
};

export const cityOptions = [
  {label: '台北市', value: '010'},
  {label: '新北市', value: '020'},
];

export const zoneOptions = [
  {label: '大安區', value: '40820'},
  {label: '信義區', value: '40821'},
];
