import { currencySymbolGenerator, dateToString } from 'utilities/Generator';
import uuid from 'react-uuid';

export const getCardListing = (d) => ([
  { key: '01', title: '帳單結帳日', content: dateToString(d.billClosingDate) },
  { key: '02', title: '繳費截止日', content: dateToString(d.payDueDate) },
  { key: '03', title: '本期應繳金額', content: currencySymbolGenerator(d.currency ?? 'NTD', d.newBalance) },
  { key: '04', title: '最低應繳金額', content: currencySymbolGenerator(d.currency ?? 'NTD', d.minDueAmount) },
  { key: '05', title: '本期累積已繳金額', content: currencySymbolGenerator(d.currency ?? 'NTD', d.paidAmount) },
  { key: '06', title: '最近繳費日', content: dateToString(d.lastPayDate) },
]);

export const getCreditListing = (d) => ([
  { key: '01', title: '你的信用卡額度', content: currencySymbolGenerator(d.currency ?? 'NTD', d.cardLimit) },
  { key: '02', title: '已使用額度', content: currencySymbolGenerator(d.currency ?? 'NTD', d.usedCardLimit) },
  { key: '03', title: '可使用額度', content: currencySymbolGenerator(d.currency ?? 'NTD', d.availCardLimit) },
  { key: '04', title: '國內預借現金可使用額度', content: currencySymbolGenerator(d.currency ?? 'NTD', d.cashAdvAvailLimitDomestic) },
  { key: '05', title: '國外預借現金可使用額度', content: currencySymbolGenerator(d.currency ?? 'NTD', d.cashAdvAvailLimitOverseas) },
]);

export const backInfo = {
  title: ['社群圈等級', '升級條件*', '國內/國外'],
  body: [
    { level: '4', condition: '達60萬', percentage: '1.20%/3%' },
    { level: '3', condition: '達24萬', percentage: '1.20%/1.20%' },
    { level: '2', condition: '達8萬', percentage: '1.00%/1.00%' },
    { level: '1', condition: '達2萬', percentage: '0.60%/0.60%' },
    { level: '0', condition: '未達2萬', percentage: '0.15%/0.15%' },
  ],
};

export const levelInfo = {
  title: ['社群圈等級', '升級條件*'],
  body: [
    { level: '4', condition: '達60萬' },
    { level: '3', condition: '達24萬' },
    { level: '2', condition: '達8萬' },
    { level: '1', condition: '達2萬' },
    { level: '0', condition: '未達2萬' },
  ],
};

export const renderHead = (titles) => titles.map((title) => (
  <th key={`${uuid()}-head`}>
    {title}
  </th>
));

export const renderBody = (bodys) => bodys.map((body) => (
  <tr key={`${uuid()}-body`}>
    <th>{body.level}</th>
    <th>{body.condition}</th>
    {body.percentage
    && <th>{body.percentage}</th>}
  </tr>
));

export const creditFormatter = (account) => (account ? `${account.slice(0, 4)}-****-****-${account.slice(12, 16)}` : '-');
