export const tabOptions = [
  { label: '預約查詢', value: '1' },
  { label: '結果查詢', value: '2' },
];

export const reserveDatePickerLimit = {
  minDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
};

export const resultDatePickerLimit = {
  minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
  maxDate: new Date(),
};
