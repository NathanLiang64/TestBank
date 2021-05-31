import { useState, useEffect } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBSwitch,
  FEIBSwitchLabel,
  FEIBInput,
  FEIBInputLabel,
  FEIBButton,
  FEIBErrorMessage,
} from 'components/elements';
import PasswordInput from 'components/PasswordInput';
import NoticeArea from 'components/NoticeArea';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';
import Alert from 'components/Alert';

/* Styles */
import theme from 'themes/theme';
import SMSOTPactivateWrapper from './smsOTPactivate.style';

const SMSOTPactivate = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    OTPPassword: yup
      .string()
      .required('請輸入您的開通密碼'),
    password: yup
      .string()
      .required('請輸入您的網銀密碼')
      .min(8, '您輸入的網銀密碼長度有誤，請重新輸入。')
      .max(20, '您輸入的網銀密碼長度有誤，請重新輸入。'),
  });
  const {
    handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  const updateOTPActiveType = () => {
    setShowConfirmDialog(false);
    setShowResultDialog(true);
  };

  const onSubmit = (data) => {
    console.log(data);
    setShowConfirmDialog(true);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <FEIBInputLabel htmlFor="phone">簡訊 OTP 號碼</FEIBInputLabel>
        <FEIBInput
          id="phone"
          name="phone"
          type="text"
          inputMode="numeric"
          value="0905556556"
          disabled
          $space="bottom"
        />
        <FEIBInputLabel htmlFor="OTPPassword">開通密碼</FEIBInputLabel>
        <Controller
          name="OTPPassword"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FEIBInput
              {...field}
              type="text"
              id="OTPPassword"
              name="OTPPassword"
              placeholder="請輸入您的開通密碼"
              error={!!errors.OTPPassword}
            />
          )}
        />
        <FEIBErrorMessage>{errors.OTPPassword?.message}</FEIBErrorMessage>
        <PasswordInput
          label="網銀密碼"
          id="password"
          name="password"
          control={control}
          placeholder="請輸入您的網銀密碼"
          errorMessage={errors.password?.message}
        />
        <NoticeArea title=" " textAlign="left" space="both">
          {noticeTip}
        </NoticeArea>
        <FEIBButton
          type="submit"
          disabled={status === 1}
        >
          {
            status === 2 ? '取消 OTP 綁定' : '立即開通'
          }
        </FEIBButton>
      </form>
      <ConfirmDialog />
      <ResultDialog />
    </SMSOTPactivateWrapper>
  );
};

export default SMSOTPactivate;
