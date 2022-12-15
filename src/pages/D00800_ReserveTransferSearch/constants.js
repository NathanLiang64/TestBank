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

export const TAB = 'tab';
export const RESERVE_DATE_RANGE = 'reserveDateRange';
export const RESULT_DATE_RANGE = 'resultDateRange';

export const defaultValues = {
  [TAB]: '1', // 切換頁數
  [RESERVE_DATE_RANGE]: [
    reserveDatePickerLimit.minDate, // 查詢預約起始日
    reserveDatePickerLimit.maxDate, // 查詢預約截止日
  ],
  [RESULT_DATE_RANGE]: [
    resultDatePickerLimit.minDate, // 結果查詢起始日
    resultDatePickerLimit.maxDate, // 結果查詢截止日
  ],
};

export const panelOptions = [
  {
    tabValue: '1',
    datePickerLimit: reserveDatePickerLimit,
    formName: RESERVE_DATE_RANGE,
  },
  {
    tabValue: '2',
    datePickerLimit: resultDatePickerLimit,
    formName: RESULT_DATE_RANGE,
  },
];
