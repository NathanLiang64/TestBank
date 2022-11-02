import { accountFormatter, weekNumberToChinese } from 'utilities/Generator';

export const generateMonthOptions = () => Array.from({ length: 22 }, (_, i) => i + 3).map((v) => ({
  label: `${v}個月`,
  value: v,
}));

export const generateCycleModeOptions = () => [
  // { label: '每週', value: 1, disabled: true },
  { label: '每月', value: 2 },
];

export const generateCycleTimingOptions = (cycleMode) => {
  if (cycleMode === 1) {
    return Array.from({ length: 7 }, (_, i) => i).map((v) => ({
      label: `周${weekNumberToChinese(v === 0 ? 7 : v)}`,
      value: v,
    }));
  }
  return Array.from({ length: 28 }, (_, i) => i + 1).map((v) => ({
    label: `${v}號`,
    value: v,
  }));
};

export const generatebindAccountNoOptions = (
  subAccounts,
  hasReachedMaxSubAccounts,
) => {
  const options = subAccounts.map(({ accountNo }) => ({
    label: accountFormatter(accountNo),
    value: accountNo,
  }));
  if (!hasReachedMaxSubAccounts) { options.push({ label: '加開子帳戶', value: 'new' }); }
  if (options.length === 0) {
    return [
      {
        label: '無未綁定的子帳戶或已達8個子帳戶上限',
        value: '*',
        disabled: true,
      },
    ];
  }

  const defaultValue = {
    label: '請選擇子帳號且不能修改',
    value: '*',
    disabled: true,
  };
  options.unshift(defaultValue);
  return options;
};
