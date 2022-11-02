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
    end.setDate(end.getDate() + (((parseInt(cycleDuration, 10) * 4) - 1) * 7));
  } else {
    // 每月
    if (end.getDate() > 28) end.setDate(28);
    end.setMonth(end.getMonth() + parseInt(cycleDuration, 10));
  }

  return { begin, end, next };
};
