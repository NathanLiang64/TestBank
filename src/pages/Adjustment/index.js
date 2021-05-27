import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import { useHistory } from 'react-router';

/* Elements */
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBSelect,
  FEIBOption,
  FEIBDatePicker,
  FEIBButton,
} from 'components/elements';
import PickersProvider from 'components/DatePickerProvider';

/* Styles */
import theme from 'themes/theme';
import AdjustmentWrapper from './adjustment.style';

const Adjustment = () => {
  const history = useHistory();
  const creditCardData = {
    number: '****-****-****-0000',
    amount: '$120,030',
    currentAmount: '10,000',
  };
  const [amount, setAmount] = useState('');
  const [applyType, setApplyType] = useState('0');
  const [useLocation, setUseLocation] = useState('0');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleApplyTypeChange = (event) => {
    setApplyType(event.target.value);
  };

  const handleUseLocationChange = (event) => {
    setUseLocation(event.target.value);
  };

  const handleStartDate = (date) => {
    setStartDate(date);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
  };

  const applyAdjustment = () => {
    history.push('/adjustment1');
  };

  useCheckLocation();
  usePageInfo('/api/adjustment');

  return (
    <AdjustmentWrapper>
      <div className="creditCard">
        <div className="numberContainer">
          <div>信用卡</div>
          <div>{creditCardData.number}</div>
        </div>
        <div className="amount">{creditCardData.amount}</div>
      </div>
      <div className="currentAmount">
        目前額度：
        {creditCardData.currentAmount}
      </div>
      <div className="inputContainer">
        <FEIBInputLabel>申請金額</FEIBInputLabel>
        <FEIBInput
          value={amount}
          type="text"
          inputMode="numric"
          placeholder="請輸入申請額度"
          onChange={handleAmountChange}
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
        />
        <span className="tailText">萬元</span>
      </div>
      <div className="inputContainer">
        <FEIBInputLabel>申請用途</FEIBInputLabel>
        <FEIBSelect
          value={applyType}
          $borderColor={theme.colors.primary.brand}
          onChange={handleApplyTypeChange}
        >
          <FEIBOption value="0">請選擇申請用途</FEIBOption>
          <FEIBOption value="1">喜宴及住宿</FEIBOption>
          <FEIBOption value="2">保費</FEIBOption>
          <FEIBOption value="3">醫療費用</FEIBOption>
          <FEIBOption value="4">旅遊團費</FEIBOption>
          <FEIBOption value="5">學費</FEIBOption>
          <FEIBOption value="6">綜所稅</FEIBOption>
          <FEIBOption value="7">其他</FEIBOption>
        </FEIBSelect>
      </div>
      <div className={applyType !== '7' ? 'inputContainer hide' : 'inputContainer'}>
        <FEIBInputLabel>其他說明</FEIBInputLabel>
        <FEIBInput
          type="text"
          placeholder="請輸入其他說明"
          multiline
          rows="3"
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
        />
      </div>
      <div className="inputContainer">
        <FEIBInputLabel>使用地點</FEIBInputLabel>
        <FEIBSelect
          value={useLocation}
          $borderColor={theme.colors.primary.brand}
          onChange={handleUseLocationChange}
        >
          <FEIBOption value="0">請選擇使用地點</FEIBOption>
          <FEIBOption value="1">國外</FEIBOption>
          <FEIBOption value="2">國內</FEIBOption>
          <FEIBOption value="3">國內外</FEIBOption>
          <FEIBOption value="4">網路</FEIBOption>
        </FEIBSelect>
      </div>
      <div className={useLocation !== '1' || useLocation !== '3' ? 'inputContainer hide' : 'inputContainer'}>
        <FEIBInputLabel>出國地點</FEIBInputLabel>
        <FEIBInput
          type="text"
          placeholder="請輸入出國地點"
          multiline
          rows="3"
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
        />
      </div>
      <div className="inputContainer">
        <FEIBInputLabel>申請期間</FEIBInputLabel>
        <div className="datePickerContainer">
          <PickersProvider>
            <FEIBDatePicker value={startDate} onChange={handleStartDate} />
            <span>-</span>
            <FEIBDatePicker value={endDate} onChange={handleEndDate} />
          </PickersProvider>
        </div>
      </div>
      <FEIBButton
        disabled={!amount || applyType === '0' || useLocation === '0'}
        onClick={applyAdjustment}
      >
        立即申請
      </FEIBButton>
    </AdjustmentWrapper>
  );
};

export default Adjustment;
