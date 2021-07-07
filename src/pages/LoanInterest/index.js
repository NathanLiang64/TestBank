import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBButton,
  FEIBInputLabel,
  FEIBSelect,
  FEIBOption,
  FEIBErrorMessage,
} from 'components/elements';
import InfoArea from 'components/InfoArea';
import DateRangePicker from 'components/DateRangePicker';

/* Styles */
// import theme from 'themes/theme';
import LoanInterestWrapper from './loanInterest.style';

const LoanInterest = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    account: yup
      .string()
      .required('請選擇貸款帳號'),
    subAccount: yup
      .string()
      .required('請選擇貸款分號'),
  });
  const {
    handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [showTable, setShowTable] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleClickDateRangePicker = (range) => {
    setStartDate(range[0]);
    setEndDate(range[1]);
  };

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <FEIBInputLabel>貸款帳號</FEIBInputLabel>
        <div className="selectContainer">
          <div className="picker">
            <Controller
              name="account"
              defaultValue=""
              control={control}
              placeholder="請選擇貸款帳號"
              render={({ field }) => (
                <FEIBSelect
                  {...field}
                  id="account"
                  name="account"
                  placeholder="請選擇貸款帳號"
                  error={!!errors.account}
                >
                  <FEIBOption value="" disabled>請選擇貸款帳號</FEIBOption>
                  <FEIBOption value="0000113253642323">0000113253642323</FEIBOption>
                  <FEIBOption value="0000113253642324">0000113253642324</FEIBOption>
                  <FEIBOption value="0000113253642325">0000113253642325</FEIBOption>
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.account?.message}</FEIBErrorMessage>
          </div>
          <div className="picker">
            <Controller
              name="subAccount"
              defaultValue=""
              control={control}
              placeholder="請選擇貸款分號"
              render={({ field }) => (
                <FEIBSelect
                  {...field}
                  id="subAccount"
                  name="subAccount"
                  placeholder="請選擇貸款分號"
                  error={!!errors.account}
                >
                  <FEIBOption value="" disabled>請選擇貸款分號</FEIBOption>
                  <FEIBOption value="001">001</FEIBOption>
                  <FEIBOption value="002">002</FEIBOption>
                  <FEIBOption value="003">003</FEIBOption>
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.subAccount?.message}</FEIBErrorMessage>
          </div>
        </div>
        <div className="datePickerContainer">
          <DateRangePicker date={[startDate, endDate]} label="繳息期間" onClick={handleClickDateRangePicker} />
        </div>
        <InfoArea>*可查詢三年內繳款紀錄，查詢區間最多一年</InfoArea>
        <FEIBButton
          type="submit"
        >
          查詢
        </FEIBButton>
      </form>
      { showTable ? <ResultTable /> : '' }
    </LoanInterestWrapper>
  );
};

export default LoanInterest;
