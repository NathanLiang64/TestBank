import { useState } from 'react';
import { useHistory } from 'react-router';

/* Elements */
import theme from 'themes/theme';
import {
  FEIBTextarea, FEIBBorderButton, FEIBInputAnimationWrapper, FEIBInput, FEIBInputLabel,
} from 'components/elements';
import { FormControlLabel, Checkbox } from 'themes/styleModules';
import { RadioButtonChecked, RadioButtonUnchecked } from '@material-ui/icons';

/* Styles */
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM = () => {
  const history = useHistory();

  const [step, setStep] = useState(0);
  const [agree, setAgree] = useState(false);

  const handleStep = (s) => {
    if (agree) {
      setStep(s);
    }
  };

  const handleCheckBoxChange = (event) => {
    setAgree(event.target.checked);
  };

  const toStep1 = () => {
    history.push('/cardLessATM/cardLessATM1');
  };

  const renderPage = () => {
    if (step === 0) {
      return (
        <div>
          {/* <FEIBInputLabel $color={theme.colors.primary.brand}>無卡提款約定事項</FEIBInputLabel> */}
          <div>無卡提款約定事項</div>
          <FEIBTextarea $color={theme.colors.primary.brand} defaultValue="(置放條款文字內容)" rowsMin={20} />
          <div style={{ background: theme.colors.primary.brand }}>
            <FormControlLabel
              control={(
                <Checkbox
                  icon={<RadioButtonUnchecked />}
                  checkedIcon={<RadioButtonChecked />}
                  name="agree"
                  checked={agree}
                  onChange={handleCheckBoxChange}
                />
              )}
              label="我已詳閱並遵守無卡體款約定事項"
            />
          </div>
          <FEIBBorderButton onClick={() => handleStep(1)}>啟用</FEIBBorderButton>
        </div>
      );
    }
    return (
      <div>
        <FEIBInputAnimationWrapper>
          <FEIBInputLabel $color={theme.colors.primary.dark}>提款密碼設定</FEIBInputLabel>
          <FEIBInput
            type="password"
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
          />
        </FEIBInputAnimationWrapper>
        <FEIBInputAnimationWrapper>
          <FEIBInputLabel $color={theme.colors.primary.dark}>確認提款密碼</FEIBInputLabel>
          <FEIBInput
            type="password"
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
          />
        </FEIBInputAnimationWrapper>
        <FEIBInputAnimationWrapper>
          <FEIBInputLabel $color={theme.colors.primary.dark}>請輸入開通驗證碼</FEIBInputLabel>
          <FEIBInput
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
          />
        </FEIBInputAnimationWrapper>
        <FEIBInputAnimationWrapper>
          <FEIBInputLabel $color={theme.colors.primary.dark}>請輸入網銀密碼</FEIBInputLabel>
          <FEIBInput
            type="password"
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
          />
        </FEIBInputAnimationWrapper>
        <div className="tip">注意事項</div>
        <FEIBBorderButton onClick={toStep1}>確定送出</FEIBBorderButton>
      </div>
    );
  };
  return (
    <CardLessATMWrapper>
      { renderPage() }
    </CardLessATMWrapper>
  );
};

export default CardLessATM;
