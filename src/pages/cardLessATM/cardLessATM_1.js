import { useState } from 'react';
import { useHistory } from 'react-router';

/* Elements */
import theme from 'themes/theme';
import {
  FEIBInputAnimationWrapper, FEIBInput, FEIBInputLabel, FEIBButton,
} from 'components/elements';

/* Styles */
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
    history.push('/cardLessATM/cardLessATM2');
  };

  const toChangePassword = () => {
    history.push('/cardLessATM/cardLessWithDrawChgPwd');
  };

  const toCurrncy = (num) => {
    const arr = num.toString().split('');
    arr.splice(-3, 0, ',');
    return arr.join('');
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
      <div className="tip">
        免費跨提次數
        <span> 6 </span>
        次 / 免費跨轉次數
        <span> 6 </span>
        次
      </div>
      <FEIBInputAnimationWrapper>
        <FEIBInputLabel $color={theme.colors.primary.dark}>您想提領多少錢呢?</FEIBInputLabel>
        <FEIBInput
          type="text"
          inputMode="numeric"
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
          value={withdrawalAmount}
          onChange={handleWithdrawalAmountInputChange}
        />
      </FEIBInputAnimationWrapper>
      <div className="money-buttons-container">
        {
          amountArr.map((item) => (
            <div key={item} className="withdrawal-btn-container">
              <FEIBButton
                $color={theme.colors.basic.white}
                $bgColor={theme.colors.primary.brand}
                $pressedBgColor={theme.colors.primary.dark}
                className="withdrawal-btn"
                onClick={() => setAmount(item)}
              >
                {
                  toCurrncy(item)
                }
              </FEIBButton>
            </div>
          ))
        }
      </div>
      <FEIBInputAnimationWrapper>
        <FEIBInputLabel $color={theme.colors.primary.dark}>網銀密碼</FEIBInputLabel>
        <FEIBInput
          type="password"
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
          value={bankPassword}
          onChange={handleBankPasswordInputChange}
        />
      </FEIBInputAnimationWrapper>
      <div className="tip" onClick={toChangePassword} aria-hidden="true">我要變更無卡提款密碼</div>
      <div className="tip">注意事項</div>
      <FEIBButton
        $color={theme.colors.basic.white}
        $bgColor={theme.colors.primary.brand}
        $pressedBgColor={theme.colors.primary.dark}
        onClick={toStep2}
      >
        下一步
      </FEIBButton>
    </CardLessATMWrapper>
  );
};

export default CardLessATM1;
