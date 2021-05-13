import { useState } from 'react';

/* Elements */
import theme from 'themes/theme';
import { FEIBTextarea, FEIBBorderButton } from 'components/elements';
import { FormControlLabel, Checkbox } from 'themes/styleModules';
import { RadioButtonChecked, RadioButtonUnchecked } from '@material-ui/icons';

const TurnOnSetting = () => {
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
      <div>密碼設定</div>
    );
  };

  return (
    <div>
      { renderPage() }
    </div>
  );
};

export default TurnOnSetting;
