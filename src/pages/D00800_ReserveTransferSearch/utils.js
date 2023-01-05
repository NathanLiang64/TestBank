import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';
import { currencySymbolGenerator, dateToString, weekNumberToChinese } from 'utilities/Generator';

const generatePeriodText = ({cycle, cycleNo}) => {
  switch (cycle) {
    case 'W':
      return `每週星期${weekNumberToChinese(Number(cycleNo))}`;
    case 'M':
      return `每月${Number(cycleNo)}號`;
    case '1':
    default:
      return '單次';
  }
};
const generatePeriodHint = (cycle) => {
  switch (cycle) {
    case '1':
      return '';
    case 'W':
    case 'M':
    default:
      return '待提供: 預計轉帳次數 成功次數 失敗次數';
  }
};

export const renderHeader = (reserveData) => (
  <>
    <div className="dataLabel">轉出金額與轉入帳號</div>
    <div className="balance">
      {currencySymbolGenerator('NTD', reserveData?.transferAmount)}
    </div>
    <div className="accountInfo">
      <div>
        {`${reserveData.bankName}(${reserveData?.receiveBank})`}
      </div>
      {reserveData?.receiveAccountNo}
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
    <InformationList title="預約轉帳日" content="待提供" />
    <InformationList
      title="週期"
      content={generatePeriodText(reserveData)}
      remark={generatePeriodHint(reserveData.cycle)}
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
