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
// import NoticeArea from 'components/NoticeArea';
import InfoArea from 'components/InfoArea';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';
import Alert from 'components/Alert';
import { passwordValidation } from 'utilities/validation';

/* Styles */
// import theme from 'themes/theme';
import SMSOTPactivateWrapper from './smsOTPactivate.style';

const SMSOTPactivate = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    OTPPassword: yup
      .string()
      .required('請輸入您的開通密碼'),
    password: passwordValidation(),
  });
  const {
    // eslint-disable-next-line no-unused-vars
    handleSubmit, control, formState: { errors }, setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 0: 密碼未逾期, 1: 密碼逾期、註銷、其他非正常狀態, 2: 已開通
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState(2);
  const initActive = true;
  const [isActive, setIsActive] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleIsActiveChange = () => {
    setIsActive(!isActive);
  };

  const changeStatus = () => {
    const newStatus = status === 0 ? 2 : 0;
    setStatus(newStatus);
    setValue('OTPPassword', '');
    setValue('password', '');
  };

  const updateOTPActiveType = () => {
    changeStatus();
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
        <Controller
          name="phone"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FEIBInput
              {...field}
              id="phone"
              name="phone"
              type="text"
              inputMode="numeric"
              value="0905556556"
              disabled
            />
          )}
        />
        <FEIBErrorMessage />
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
          errorMessage={errors.password?.message}
        />
        <InfoArea space="both">
          {
            status === 0 ? (<p>完成簡訊 OTP 服務開通，即可立即使用 Bankee APP 執行非約定轉帳交易</p>)
              : (<p>提醒您：本服務取消後，將無法使用 Bankee APP 執行非約定轉帳交易，如未來欲使用該服務，請親至各分行或以晶片金融卡於本行 ATM(WebATM) 重新申請本服務，謝謝。</p>)
            // if (getStatus() === 1 && !initActive) {
            //   setNoticeTip(<p style={{ color: theme.colors.text.point }}>親愛的客戶您好：您申請「簡訊 OTP 服務」已***，......</p>);
            // }
          }
        </InfoArea>
        <FEIBButton
          type="submit"
          disabled={(status === 0 && !isActive) || (status === 2 && isActive)}
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
