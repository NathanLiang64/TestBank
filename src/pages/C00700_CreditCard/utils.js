import { currencySymbolGenerator, dateFormatter, stringToDate } from 'utilities/Generator';
import uuid from 'react-uuid';
import EmptyData from 'components/EmptyData';
import { FEIBIconButton } from 'components/elements';
import { EditIcon } from 'assets/images/icons';
import DetailCardWrapper from './components/detailCreditCard.style';

export const getCardListing = (d) => ([
  { key: '01', title: '帳單結帳日', content: dateFormatter(stringToDate(d.billClosingDate)) },
  { key: '02', title: '繳費截止日', content: dateFormatter(stringToDate(d.payDueDate)) },
  { key: '03', title: '本期應繳金額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.newBalance) },
  { key: '04', title: '最低應繳金額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.minDueAmount) },
  { key: '05', title: '本期累積已繳金額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.paidAmount) },
  { key: '06', title: '最近繳費日', content: dateFormatter(stringToDate(d.lastPayDate)) },
]);

export const getCreditListing = (d) => ([
  { key: '01', title: '你的信用卡額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.cardLimit) },
  { key: '02', title: '已使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.usedCardLimit) },
  { key: '03', title: '可使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.availCardLimit) },
  { key: '04', title: '國內預借現金可使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.cashAdvAvailLimitDomestic) },
  { key: '05', title: '國外預借現金可使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.cashAdvAvailLimitOverseas) },
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

// Formatter
// 將日期格式由 YYYYMMDD 字串轉為 MM/DD 字串
export const stringDateFormat = (stringDate) => {
  if (stringDate) return `${stringDate.slice(4, 6)}/${stringDate.slice(6, 8)}`;
  return '';
};
  // 信用卡號顯示後四碼
export const creditNumberFormat = (stringCredit) => {
  if (stringCredit) return `${stringCredit.slice(-4)}`;
  return '';
};

// 信用卡交易明細列表
export const renderTransactionList = ({
  transactions, showAll, isBankeeCard, showMemoEditDialog,
}) => {
  if (!transactions.length) {
    return (
      <div style={{marginTop: '10rem'}}>
        <EmptyData content="查無信用卡交易明細" />
      </div>
    );
  }
  const arr = showAll ? transactions : transactions.slice(0, 3); // 至多只輸出三筆資料

  return (
    <div style={{ paddingTop: '2.5rem' }}>
      {arr.map((transaction, index) => (
        <DetailCardWrapper
          key={uuid()}
          data-index={index}
          noShadow
          id={transaction.txKey}
        >
          <div className="description">
            <h4>{transaction.txName}</h4>
            <p>
              {stringDateFormat(transaction.txDate)}
              {isBankeeCard === 'N'
                && ` | 卡-${creditNumberFormat(transaction.cardNo)}`}
            </p>
          </div>
          <div className="amount">
            {/* 刷卡金額 */}
            <h4>{currencySymbolGenerator('NTD', transaction.amount)}</h4>
            <div className="remark">
              <span>{transaction.note}</span>
              <FEIBIconButton
                $fontSize={1.6}
                onClick={() => showMemoEditDialog(transaction, index)}
                className="badIcon"
              >
                <EditIcon />
              </FEIBIconButton>
            </div>
          </div>
        </DetailCardWrapper>
      ))}
    </div>
  );
};
