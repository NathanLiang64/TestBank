import { useState, useEffect } from 'react';

import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBSwitch,
  FEIBSwitchLabel,
  FEIBInput,
  FEIBInputLabel,
  FEIBButton,
} from 'components/elements';
import NoticeArea from 'components/NoticeArea';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';
import Alert from 'components/Alert';

/* Styles */
import theme from 'themes/theme';
import SMSOTPactivateWrapper from './smsOTPactivate.style';

const SMSOTPactivate = () => {
  // 0: 密碼未逾期, 1: 密碼逾期、註銷、其他非正常狀態, 2: 已開通
  const status = 2;
  const initActive = true;
  const [noticeTip, setNoticeTip] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const getStatus = () => status;

  const handleIsActiveChange = () => {
    setIsActive(!isActive);
  };

  const handleButtonClick = () => {
    setShowConfirmDialog(true);
  };

  const updateOTPActiveType = () => {
    setShowConfirmDialog(false);
    setShowResultDialog(true);
  };

  const ResultContent = (result) => {
    const alertText = result ? '開通完成' : '完成取消';
    const contentText = result ? '您的簡訊 OTP 功能已開通' : '您的簡訊 OTP 功能已取消';
    return (
      <>
        <Alert state="success">{alertText}</Alert>
        <p>{contentText}</p>
      </>
    );
  };

  const ResultDialog = () => (
    <Dialog
      isOpen={showResultDialog}
      onClose={() => setShowResultDialog(false)}
      content={
        ResultContent(isActive)
      }
      action={
        <FEIBButton onClick={() => setShowResultDialog(false)}>確定</FEIBButton>
      }
    />
  );

  const ConfirmContent = (result) => {
    const content = result ? '您確定要開通簡訊 OTP 功能嗎？' : '您確定要取消簡訊 OTP 功能嗎？';
    return content;
  };

  const ConfirmDialog = () => (
    <Dialog
      isOpen={showConfirmDialog}
      onClose={() => setShowConfirmDialog(false)}
      content={ConfirmContent(isActive)}
      action={(
        <ConfirmButtons
          mainButtonOnClick={() => updateOTPActiveType()}
          subButtonOnClick={() => setShowConfirmDialog(false)}
        />
      )}
    />
  );

  useCheckLocation();
  usePageInfo('/api/smsOTPactivate');

  useEffect(() => {
    if (getStatus() === 0 && !initActive) {
      setNoticeTip(<p>完成簡訊 OTP 服務開通，即可立即使用 Bankee APP 執行非約定轉帳交易</p>);
    }
    if (getStatus() === 1 && !initActive) {
      setNoticeTip(<p style={{ color: theme.colors.text.point }}>親愛的客戶您好：您申請「簡訊 OTP 服務」已***，......</p>);
    }
    if (getStatus() === 2 && initActive) {
      setNoticeTip(<p>提醒您：本服務取消後，將無法使用 Bankee APP 執行非約定轉帳交易，如未來欲使用該服務，請親至各分行或以晶片金融卡於本行 ATM(WebATM) 重新申請本服務，謝謝。</p>);
    }
    setIsActive(initActive);
  }, []);

  return (
    <SMSOTPactivateWrapper>
      <div className="switchContainer">
        <FEIBSwitchLabel
          control={(
            <FEIBSwitch
              checked={isActive}
              disabled={status === 1}
              onChange={handleIsActiveChange}
            />
          )}
          label="簡訊 OTP 開通"
          $hasBorder
        />
      </div>
      <FEIBInputLabel>簡訊 OTP 號碼</FEIBInputLabel>
      <FEIBInput
        id="phone"
        name="phone"
        type="text"
        inputMode="numeric"
        value="0905556556"
        disabled
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
      />
      <FEIBInputLabel>開通密碼</FEIBInputLabel>
      <FEIBInput
        id="OTPPassword"
        name="OTPPassword"
        type="password"
        placeholder="請輸入您的開通密碼"
        disabled={status === 1}
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
      />
      <FEIBInputLabel>網銀密碼</FEIBInputLabel>
      <FEIBInput
        id="feibPassword"
        name="feibPassword"
        type="password"
        placeholder="請輸入您的網銀密碼"
        disabled={status === 1}
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
      />
      <NoticeArea title=" " textAlign="left">
        {noticeTip}
      </NoticeArea>
      <FEIBButton
        disabled={status === 1}
        onClick={handleButtonClick}
      >
        {
          status === 2 ? '取消 OTP 綁定' : '立即開通'
        }
      </FEIBButton>
      <ConfirmDialog />
      <ResultDialog />
    </SMSOTPactivateWrapper>
  );
};

export default SMSOTPactivate;
