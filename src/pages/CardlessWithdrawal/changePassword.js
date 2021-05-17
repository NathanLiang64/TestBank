import { useState } from 'react';

/* Elements */
import theme from 'themes/theme';
import {
  FEIBInputAnimationWrapper, FEIBInput, FEIBInputLabel, FEIBBorderButton,
} from 'components/elements';

/* Styles */
import CardlessWithdrawalWrapper from './cardlessWithdrawal.style';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(event.target.value);
  };

  return (
    <CardlessWithdrawalWrapper>
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
      <FEIBBorderButton>確定送出</FEIBBorderButton>
    </CardlessWithdrawalWrapper>
  );
};

export default ChangePassword;
