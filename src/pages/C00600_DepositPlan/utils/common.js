export const getDurationTuple = (today, cycleDuration, cycleMode, cycleTiming) => {
  const day = today.getDate();
  const month = today.getMonth();

  const begin = new Date(today);
  if (cycleTiming < day) {
    if (cycleTiming < 28) {
      begin.setDate(cycleTiming);
      begin.setMonth(month + 1);
    }
  } else {
    begin.setDate(cycleTiming);
  }

  const end = new Date(begin);
  if (end.getDate() > 28) end.setDate(28);
  if (cycleMode === 1) {
    end.setDate(end.getDate() + (((cycleDuration * 4) - 1) * 7));
  } else {
    end.setMonth(end.getMonth() + cycleDuration);
  }

  const next = new Date(begin);
  if (next.getDate() > 28) next.setDate(28);
  if (cycleMode === 1) {
    next.setDate(next.getDate() + 7);
  } else {
    next.setMonth(next.getMonth() + 1);
  }
  return { begin, end, next };
};
