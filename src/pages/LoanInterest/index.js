import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBButton,
  FEIBInputLabel,
  FEIBSelect,
  FEIBOption,
  FEIBDatePicker,
} from 'components/elements';
import PickersProvider from 'components/DatePickerProvider';

/* Styles */
import theme from 'themes/theme';
import LoanInterestWrapper from './loanInterest.style';

const LoanInterest = () => {
  const [account, setAccount] = useState('0');
  const [subAccount, setSubAccount] = useState('0');
  const [showTable, setShowTable] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleAccountChange = (event) => {
    setAccount(event.target.value);
  };

  const handleSubAccountChange = (event) => {
    setSubAccount(event.target.value);
  };

  const handleStartDate = (date) => {
    setStartDate(date);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
  };

  const handleSearchClick = () => {
    setShowTable(true);
  };

  const ResultTable = () => (
    <table className="resultTable">
      <tbody>
        <tr>
          <td>交易日</td>
          <td>110/03/18</td>
        </tr>
        <tr>
          <td>交易種類</td>
          <td>還本付息</td>
        </tr>
        <tr>
          <td>攤還本金</td>
          <td>$14,077</td>
        </tr>
        <tr>
          <td>利息</td>
          <td>$1,126</td>
        </tr>
        <tr>
          <td>逾期息</td>
          <td>$0</td>
        </tr>
        <tr>
          <td>違約金</td>
          <td>$0</td>
        </tr>
        <tr>
          <td>利率</td>
          <td>1.050%</td>
        </tr>
        <tr>
          <td>應繳金額</td>
          <td>$15,203</td>
        </tr>
        <tr>
          <td>本金金額</td>
          <td>$1,272,963</td>
        </tr>
      </tbody>
    </table>
  );

  useCheckLocation();
  usePageInfo('/api/loanInterest');

  return (
    <LoanInterestWrapper>
      <FEIBInputLabel>貸款帳號</FEIBInputLabel>
      <div className="datePickerContainer">
        <div className="picker">
          <FEIBSelect
            value={account}
            $borderColor={theme.colors.primary.brand}
            onChange={handleAccountChange}
          >
            <FEIBOption value="0">請選擇貸款帳號</FEIBOption>
            <FEIBOption value="0000113253642323">0000113253642323</FEIBOption>
            <FEIBOption value="0000113253642324">0000113253642324</FEIBOption>
            <FEIBOption value="0000113253642325">0000113253642325</FEIBOption>
          </FEIBSelect>
        </div>
        <div className="picker">
          <FEIBSelect
            value={subAccount}
            $borderColor={theme.colors.primary.brand}
            onChange={handleSubAccountChange}
          >
            <FEIBOption value="0">請選擇貸款分號</FEIBOption>
            <FEIBOption value="001">001</FEIBOption>
            <FEIBOption value="002">002</FEIBOption>
            <FEIBOption value="003">003</FEIBOption>
          </FEIBSelect>
        </div>
      </div>
      <FEIBInputLabel>繳息期間</FEIBInputLabel>
      <div className="datePickerContainer">
        <PickersProvider>
          <FEIBDatePicker value={startDate} onChange={handleStartDate} />
          <span>-</span>
          <FEIBDatePicker value={endDate} onChange={handleEndDate} />
        </PickersProvider>
      </div>
      <p className="point">*可查詢三年內繳款紀錄，查詢區間最多一年</p>
      <FEIBButton
        disabled={account === '0' || subAccount === '0'}
        onClick={handleSearchClick}
      >
        查詢
      </FEIBButton>
      { showTable ? <ResultTable /> : '' }
    </LoanInterestWrapper>
  );
};

export default LoanInterest;
