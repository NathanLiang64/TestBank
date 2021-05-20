import { useState } from 'react';
import { useHistory } from 'react-router';

/* Elements */
import theme from 'themes/theme';
import {
  FEIBInputAnimationWrapper, FEIBInput, FEIBInputLabel, FEIBButton,
} from 'components/elements';

/* Styles */
import CardLessATMWrapper from './cardLessATM.style';

const CardLessWithDrawChgPwd = () => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(event.target.value);
  };

  const toStep1 = () => {
    history.push('/cardLessATM/cardLessATM1');
  };

  return (
    <CardLessATMWrapper>
      <FEIBInputAnimationWrapper>
        <FEIBInputLabel $color={theme.colors.primary.dark}>提款密碼設定</FEIBInputLabel>
        <FEIBInput
          type="password"
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
          value={password}
          onChange={handlePasswordChange}
        />
      </FEIBInputAnimationWrapper>
      <FEIBInputAnimationWrapper>
        <FEIBInputLabel $color={theme.colors.primary.dark}>確認提款密碼</FEIBInputLabel>
        <FEIBInput
          type="password"
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
          value={passwordConfirm}
          onChange={handlePasswordConfirmChange}
        />
      </FEIBInputAnimationWrapper>
      <div className="tip">注意事項</div>
      <FEIBButton
        onClick={toStep1}
      >
        確定送出
      </FEIBButton>
    </CardLessATMWrapper>
  );
};

export default CardLessWithDrawChgPwd;
