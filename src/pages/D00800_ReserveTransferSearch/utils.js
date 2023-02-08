import InformationList from 'components/InformationList';
import {
  currencySymbolGenerator, dateToString, stringToDate, toCurrency, weekNumberToChinese,
} from 'utilities/Generator';

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

/**
   * 計算預約交易日期區間將會發生的轉帳次數。
   * @returns 預估的轉帳次數。
   */
// TODO 要求後端回傳的結構與轉帳相同，即可與 D00100 的 checkTransDate 共用
export const checkTransDate = (booking) => {
  // transRange: 轉帳日期區間，multiTimes='*'時。
  // cycleMode: 交易頻率: 1.每周, 2.每月
  // cycleTiming: 交易週期: 〔 0~6: 周日~周六 〕或〔 1~28: 每月1~31 〕
  const {
    cycle: cycleMode, cycleNo: cycleTiming, startDay, endDay,
  } = booking;

  const startDate = new Date(stringToDate(startDay)); // 要另建新日期物件，否則原值會被改掉。
  const endDate = new Date(stringToDate(endDay)); // 同上。

  if (cycleMode === 'W') {
    // 當起(迄)日不是指定的WeekDay時，計算差異天數，將起(迄)日改為第一(最後)個預約轉帳日，再計算次數。
    let diffDays = (7 + (parseInt(cycleTiming, 10) - startDate.getDay())) % 7;
    if (diffDays >= 0) startDate.setDate(startDate.getDate() + diffDays);

    diffDays = (7 + (endDate.getDay() - parseInt(cycleTiming, 10))) % 7;
    if (diffDays >= 0) endDate.setDate(endDate.getDate() - diffDays);

    const times = (endDate - startDate) / (7 * 24 * 60 * 60 * 1000) + 1;
    return times;
  }

  // 計算按月轉帳的總次數。
  let times = 0;
  for (let d0 = new Date(startDate); ;) {
    const d1 = new Date(d0);
    d1.setDate(parseInt(cycleTiming, 10));
    if (d1 >= d0) {
      if (d1 > endDate) break;
      times++;
    }
    // 下個月的起日，要用 1日是因為，要避免次月沒有 29/30/31 時，月份會再進位的問題。
    d0.setDate(1);
    d0.setMonth(d0.getMonth() + 1);
  }
  return times;
};

const generatePeriodHint = (data) => {
  switch (data.cycle) {
    case '1':
      return '';
    case 'W':
    case 'M':
    default:
      return `預計轉帳${checkTransDate(data)}次 | 成功${data.successCnt}次 | 失敗${data.failureCnt}次`;
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
    <InformationList
      title="預約轉帳日"
      content={dateToString(reserveData.nextBookDate)}
    />
    <InformationList
      title="週期"
      content={generatePeriodText(reserveData)}
      remark={generatePeriodHint(reserveData)}
    />
    {reserveData.periodic && (
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
  <>
    <InformationList
      title="預約設定日"
      content={dateToString(reserveData.rgDay)}
    />
    {reserveData.periodic && (
      <InformationList
        title="預約轉帳總金額"
        content={`$${toCurrency(
          reserveData.transferAmount * checkTransDate(reserveData),
        )}`}
      />
    )}
    <InformationList
      title="帳戶餘額"
      content={`${currencySymbolGenerator('NTD', selectedAccount?.balance)}`}
      remark={selectedAccount?.alias}
    />
    <InformationList title="備註" content={reserveData.remark} />
  </>
);
