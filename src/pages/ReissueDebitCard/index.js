import { useState } from 'react';
import ConfirmButtons from 'components/ConfirmButtons';

/* Elements */
import { FEIBInput, FEIBInputLabel, FEIBInputAnimationWrapper } from 'components/elements';

/* Styles */
import theme from 'themes/theme';
import ReissueDebitCardWrapper from './reissueDebitCard.style';

const ReissueDebitCard = () => {
  const [inputValues, setInputValues] = useState({
    account: '',
    cardState: '已啟用',
  });
  const handleChangeInput = (event) => {
    setInputValues({ ...inputValues, [event.target.name]: event.target.value });
  };

  return (
    <ReissueDebitCardWrapper>
      <FEIBInputAnimationWrapper>
        <FEIBInputLabel $color={theme.colors.primary.dark}>帳號</FEIBInputLabel>
        <FEIBInput
          name="account"
          value={inputValues.account}
          onChange={handleChangeInput}
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
        />
      </FEIBInputAnimationWrapper>

      <div>
        <FEIBInputLabel $color={theme.colors.primary.dark}>金融卡狀態</FEIBInputLabel>
        <FEIBInput
          name="cardState"
          value={inputValues.cardState}
          readOnly
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
        />
      </div>

      <ConfirmButtons
        mainButtonValue="掛失"
        // mainButtonOnClick={}
        subButtonValue="取消"
        // subButtonOnClick={}
      />
    </ReissueDebitCardWrapper>
  );
};

export default ReissueDebitCard;
