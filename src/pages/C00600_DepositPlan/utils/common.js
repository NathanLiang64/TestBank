import { accountFormatter, weekNumberToChinese } from 'utilities/Generator';

const findNextDayOffset = (from, cycleTiming) => {
  let offset = 1;
  const day = new Date(from);
  while (offset <= 7 && day.getDay() === cycleTiming) {
    offset += 1;
    day.setDate(day.getDate() + offset);
  }
  return offset;
};

// 計算存錢計畫的 開始、下次扣款、和結束日期。
export const getDurationTuple = (today, cycleDuration, cycleMode, cycleTiming) => {
  const day = today.getDate();
  const month = today.getMonth();

  const begin = new Date(today);
  if (cycleMode === 1) { // 每週
    const weekday = today.getDay();
    const offset = (weekday !== cycleTiming) ? findNextDayOffset(new Date(today), cycleTiming) : 0;
    if (offset) begin.setDate(begin.getDate() + offset);
  } else if (cycleTiming < day) {
    // 每月 下個月
    if (cycleTiming < 28) {
      begin.setDate(cycleTiming);
      begin.setMonth(month + 1);
    }
  } else {
    // 每月 當月
    begin.setDate(cycleTiming);
  }

  const next = new Date(begin);
  if (cycleMode === 1) {
    // 每週
    next.setDate(next.getDate() + 7);
  } else {
    // 每月
    if (next.getDate() > 28) next.setDate(28);
    next.setMonth(next.getMonth() + 1);
  }

  const end = new Date(begin);
  if (cycleMode === 1) {
    // 每週
    end.setDate(end.getDate() + (((cycleDuration * 4) - 1) * 7));
  } else {
    // 每月
    if (end.getDate() > 28) end.setDate(28);
    end.setMonth(end.getMonth() + cycleDuration);
  }

  return { begin, end, next };
};

export const generateMonthOptions = () => Array.from({ length: 22 }, (_, i) => i + 3).map((v) => ({
  label: `${v}個月`,
  value: v,
}));

export const generateCycleModeOptions = () => [
  { label: '每週', value: 1, disabled: true },
  { label: '每月', value: 2 },
];

export const generateCycleTimingOptions = (cycleMode) => {
  if (cycleMode === 1) {
    return Array.from({ length: 7 }, (_, i) => i).map((v) => (
      {
        label: `周${weekNumberToChinese(v === 0 ? 7 : v)}`,
        value: v,
      }
    ));
  }
  return Array.from({ length: 28 }, (_, i) => i + 1).map((v) => (
    {label: `${v}號`, value: v}
  ));
};

export const generatebindAccountNoOptions = (
  subAccounts,
  hasReachedMaxSubAccounts,
) => {
  if (subAccounts.length === 0) {
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
  const options = subAccounts.map(({ accountNo }) => ({
    label: accountFormatter(accountNo),
    value: accountNo,
  }));
  options.unshift(defaultValue);
  if (!hasReachedMaxSubAccounts) options.push({ label: '加開子帳戶', value: 'new' });
  return options;
};
