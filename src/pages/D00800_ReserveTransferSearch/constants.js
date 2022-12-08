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

export const defaultValues = {
  tab: '1', // 切換頁數
  reserveDateRange: [
    reserveDatePickerLimit.minDate, // 查詢預約起始日
    reserveDatePickerLimit.maxDate, // 查詢預約截止日
  ],
  resultDateRange: [
    resultDatePickerLimit.minDate, // 結果查詢起始日
    resultDatePickerLimit.maxDate, // 結果查詢截止日
  ],
};
