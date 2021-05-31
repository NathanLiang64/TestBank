import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBButton,
  FEIBInputAnimationWrapper,
  FEIBCheckboxLabel,
  FEIBCheckbox,
} from 'components/elements';
import PasswordInput from 'components/PasswordInput';
import NoticeArea from 'components/NoticeArea';

/* Styles */
import theme from 'themes/theme';
import CardLessATMWrapper from './cardLessATM.style';

import DealContent from './dealContent';

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
    history.push('/cardLessATM1');
  };

  const renderPage = () => {
    if (step === 0) {
      return (
        <>
          <NoticeArea title="無卡提款約定事項" textAlign="left">
            <DealContent />
          </NoticeArea>
          <FEIBCheckboxLabel
            control={(
              <FEIBCheckbox
                color="default"
                onChange={handleCheckBoxChange}
              />
            )}
            label="我已詳閱並遵守無卡體款約定事項"
            $color={theme.colors.primary.brand}
          />
          <FEIBButton
            disabled={!agree}
            onClick={() => handleStep(1)}
          >
            啟用
          </FEIBButton>
        </>
      );
    }
    return (
      <div>
        <FEIBInputAnimationWrapper>
          <PasswordInput
            label="提款密碼"
            placeholder="請輸入提款密碼"
          />
        </FEIBInputAnimationWrapper>
        <FEIBInputAnimationWrapper>
          <PasswordInput
            label="確認提款密碼"
            placeholder="請再輸入一次提款密碼"
          />
        </FEIBInputAnimationWrapper>
        <FEIBInputAnimationWrapper>
          <PasswordInput
            label="開通驗證碼"
            placeholder="請輸入開通驗證碼"
          />
        </FEIBInputAnimationWrapper>
        <FEIBInputAnimationWrapper>
          <PasswordInput
            label="網銀密碼"
            placeholder="請輸入網銀密碼"
          />
        </FEIBInputAnimationWrapper>
        <div className="tip">注意事項</div>
        <FEIBButton
          onClick={toStep1}
        >
          確定送出
        </FEIBButton>
      </div>
    );
  };

  useCheckLocation();
  usePageInfo('/api/cardLessATM');

  return <CardLessATMWrapper>{renderPage()}</CardLessATMWrapper>;
};

export default CardLessATM;
