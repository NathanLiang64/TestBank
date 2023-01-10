import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';
import { currencySymbolGenerator, dateToString, weekNumberToChinese } from 'utilities/Generator';

export const generatePeriodText = ({cycle, cycleNo}) => {
  switch (cycle) {
    case 'W':
      return `每週星期${weekNumberToChinese(Number(cycleNo))}`;
    case 'M':
      return `每個月${Number(cycleNo)}號`;
    case '1':
    default:
      return '單次';
  }
};
const generatePeriodHint = ({
  cycle, totCnt, successCnt, failureCnt,
}) => {
  switch (cycle) {
    case '1':
      return '';
    case 'W':
    case 'M':
    default:
      return `預計轉帳${totCnt}次 | 成功${successCnt}次 | 失敗${failureCnt}次`;
  }
};

export const renderHeader = (data) => (
  <>
    <div className="dataLabel">轉出金額與轉入帳號</div>
    <div className="balance">
      {currencySymbolGenerator('NTD', data?.transferAmount)}
    </div>
    <div className="accountInfo">
      <div>
        {`${data.bankName}(${data.receiveBank})`}
      </div>
      {data.receiveAccountNo}
    </div>
  </>
);

export const renderBody = (reserveData, selectedAccount) => (
  <>
    <InformationList
      title="轉出帳號"
      content={selectedAccount?.accountNo}
      remark={selectedAccount?.alias}
    />
    <InformationList title="預約轉帳日" content={dateToString(reserveData.nextBookDate)} />
    <InformationList
      title="週期"
      content={generatePeriodText(reserveData)}
      remark={generatePeriodHint(reserveData)}
    />
    {reserveData.isMulti && (
      <InformationList
        title="期間"
        content={`${dateToString(reserveData.startDay)}~${dateToString(
          reserveData.endDay,
        )}`}
      />
    )}
  </>
);

export const renderFooter = (reserveData, selectedAccount) => (
  <Accordion title="詳細交易" space="bottom">
    <InformationList
      title="預約設定日"
      content={dateToString(reserveData.rgDay)}
    />
    {reserveData.isMulti && (
      <InformationList
        title="預約轉帳總金額"
        content="待提供"
      />
    )}
    <InformationList
      title="帳戶餘額"
      content={`${currencySymbolGenerator('NTD', selectedAccount?.balance)}`}
      remark={selectedAccount?.alias}
    />
    <InformationList title="備註" content={reserveData.remark} />
  </Accordion>
);
