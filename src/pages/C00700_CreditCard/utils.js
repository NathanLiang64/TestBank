import { currencySymbolGenerator, dateFormatter, stringToDate } from 'utilities/Generator';

export const getCardListing = (d) => ([
  { title: '帳單結帳日', content: dateFormatter(stringToDate(d.invoiceDate)) },
  { title: '繳費截止日', content: dateFormatter(stringToDate(d.billDate)) },
  { title: '本期應繳金額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.amount) },
  { title: '最低應繳金額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.minAmount) },
  { title: '本期累積已繳金額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.accumulatedPaid) },
  { title: '最近繳費日', content: dateFormatter(stringToDate(d.recentPayDate)) },
]);

export const getCreditListing = (d) => ([
  { title: '你的信用卡額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.credit) },
  { title: '已使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.creditUsed) },
  { title: '可使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.creditAvailable) },
  { title: '國內預借現金可使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.localCashCredit) },
  { title: '國外預借現金可使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.foreignCashCredit) },
]);
