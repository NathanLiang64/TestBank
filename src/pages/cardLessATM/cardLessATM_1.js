import { useState } from 'react';
import { useHistory } from 'react-router';

/* Elements */
import theme from 'themes/theme';
import {
  FEIBInputAnimationWrapper, FEIBInput, FEIBInputLabel, FEIBBorderButton,
} from 'components/elements';

/* Styles */
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM1 = () => {
  const history = useHistory();

  const amountArr = [1000, 2000, 3000, 5000, 10000, 20000];

  const [withdrawalAmount, setWithdrawalAmount] = useState('');

  const setAmount = (amount) => {
    setWithdrawalAmount(amount);
  };

  const handleInputChange = (event) => {
    setWithdrawalAmount(event.target.value);
  };

  const toStep2 = () => {
    history.push('/cardLessATM/cardLessATM2');
  };

  const toChangePassword = () => {
    history.push('/cardLessATM/cardLessWithDrawChgPwd');
  };

  return (
    <CardLessATMWrapper>
      <div className="account-info">
        <h1>
          活儲帳戶 04304099001568
        </h1>
        <h1>
          可用餘額 NT $ 168,000
        </h1>
      </div>
      <FEIBInputAnimationWrapper>
        <FEIBInputLabel $color={theme.colors.primary.dark}>您想提領多少錢呢?</FEIBInputLabel>
        <FEIBInput
          type="text"
          inputMode="numeric"
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
          value={withdrawalAmount}
          onChange={handleInputChange}
        />
      </FEIBInputAnimationWrapper>
      <div className="money-buttons-container">
        {
          amountArr.map((item) => (
            <div className="withdrawal-btn-container">
              <FEIBBorderButton className="withdrawal-btn" key={item} onClick={() => setAmount(item)}>{item}</FEIBBorderButton>
            </div>
          ))
        }
      </div>
      <div className="tip" onClick={toChangePassword} aria-hidden="true">我要變更無卡提款密碼</div>
      <div className="tip">注意事項</div>
      <FEIBBorderButton onClick={toStep2}>下一步</FEIBBorderButton>
    </CardLessATMWrapper>
  );
};

export default CardLessATM1;
