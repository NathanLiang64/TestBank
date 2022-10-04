import { currencySymbolGenerator, dateFormatter, stringToDate } from 'utilities/Generator';

export const getCardListing = (d) => ([
  { title: '帳單結帳日', content: dateFormatter(stringToDate(d.billClosingDate)) },
  { title: '繳費截止日', content: dateFormatter(stringToDate(d.payDueDate)) },
  { title: '本期應繳金額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.newBalance) },
  { title: '最低應繳金額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.minDueAmount) },
  { title: '本期累積已繳金額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.paidAmount) },
  { title: '最近繳費日', content: dateFormatter(stringToDate(d.lastPayDate)) },
]);

export const getCreditListing = (d) => ([
  { title: '你的信用卡額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.cardLimit) },
  { title: '已使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.usedCardLimit) },
  { title: '可使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.availCardLimit) },
  { title: '國內預借現金可使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.cashAdvAvailLimitDomestic) },
  { title: '國外預借現金可使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.cashAdvAvailLimitOverseas) },
]);

export const backInfo = {
  title: ['社群圈等級', '升級條件*', '國內/國外'],
  body: [{
    level: '4',
    condition: '達60萬',
    percentage: '1.20%/3%',
  },
  {
    level: '3',
    condition: '達24萬',
    percentage: '1.20%/1.20%',
  },
  {
    level: '2',
    condition: '達8萬',
    percentage: '1.00%/1.00%',
  },
  {
    level: '1',
    condition: '達2萬',
    percentage: '0.60%/0.60%',
  },
  {
    level: '0',
    condition: '未達2萬',
    percentage: '0.15%/0.15%',
  },
  ],
};

export const levelInfo = {
  title: ['社群圈等級', '升級條件*'],
  body: [{
    level: '4',
    condition: '達60萬',
  },
  {
    level: '3',
    condition: '達24萬',
  },
  {
    level: '2',
    condition: '達8萬',
  },
  {
    level: '1',
    condition: '達2萬',
  },
  {
    level: '0',
    condition: '未達2萬',
  },
  ],
};
