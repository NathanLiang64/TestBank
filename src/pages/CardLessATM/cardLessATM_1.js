import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBInputAnimationWrapper, FEIBInput, FEIBInputLabel, FEIBButton, FEIBBorderButton,
} from 'components/elements';
import DebitCard from 'components/DebitCard';
import PasswordInput from 'components/PasswordInput';

/* Styles */
// import theme from 'themes/theme';
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM1 = () => {
  const history = useHistory();

  const amountArr = [1000, 2000, 3000, 5000, 10000, 20000];

  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [bankPassword, setBankPassword] = useState('');

  const setAmount = (amount) => {
    setWithdrawalAmount(amount);
  };

  const handleWithdrawalAmountInputChange = (event) => {
    setWithdrawalAmount(event.target.value);
  };

  const handleBankPasswordInputChange = (event) => {
    setBankPassword(event.target.value);
  };

  const toStep2 = () => {
    history.push('/cardLessATM2');
  };

  const toChangePassword = () => {
    history.push('/cardLessWithDrawChgPwd');
  };

  const toCurrncy = (num) => {
    const arr = num.toString().split('');
    arr.splice(-3, 0, ',');
    return arr.join('');
  };

  useCheckLocation();
  usePageInfo('/api/cardLessATM');

  return (
    <CardLessATMWrapper>
      <DebitCard
        cardName="存款卡"
        account="04304099001568"
        balance="168,000"
      />
      <div className="tip">
        免費跨提次數
        <span> 6 </span>
        次 / 免費跨轉次數
        <span> 6 </span>
        次
      </div>
      <FEIBInputAnimationWrapper>
        <FEIBInputLabel>您想提領多少錢呢?</FEIBInputLabel>
        <FEIBInput
          type="text"
          inputMode="numeric"
          // $color={theme.colors.primary.dark}
          // $borderColor={theme.colors.primary.brand}
          value={withdrawalAmount}
          onChange={handleWithdrawalAmountInputChange}
        />
      </FEIBInputAnimationWrapper>
      <div className="amountButtonsContainer">
        {
          amountArr.map((item) => (
            <div key={item} className="withdrawalBtnContainer">
              <FEIBBorderButton
                className="withdrawal-btn"
                onClick={() => setAmount(item)}
              >
                {
                  toCurrncy(item)
                }
              </FEIBBorderButton>
            </div>
          ))
        }
      </div>
      <FEIBInputAnimationWrapper>
        <PasswordInput
          label="網銀密碼"
          value={bankPassword}
          onChange={handleBankPasswordInputChange}
        />
      </FEIBInputAnimationWrapper>
      <div className="tip" onClick={toChangePassword} aria-hidden="true">我要變更無卡提款密碼</div>
      <div className="tip">注意事項</div>
      <FEIBButton
        onClick={toStep2}
      >
        下一步
      </FEIBButton>
    </CardLessATMWrapper>
  );
};

export default CardLessATM1;
