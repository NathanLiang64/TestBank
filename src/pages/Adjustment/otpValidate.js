import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
// import NoticeArea from 'components/NoticeArea';
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBButton,
  FEIBErrorMessage,
} from 'components/elements';
import Dialog from 'components/Dialog';
import Alert from 'components/Alert';
import PasswordInput from 'components/PasswordInput';

/* Styles */
import theme from 'themes/theme';
import AdjustmentWrapper from './adjustment.style';

const CountDown = () => {
  const [countSec, setCountSec] = useState(5 * 60);

  const formatCountSec = (count) => {
    const min = Math.floor(count / 60);
    const sec = count % 60;
    return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
  };

  useEffect(() => {
    const countDown = setInterval(() => {
      if (countSec > 0) {
        // eslint-disable-next-line no-shadow
        setCountSec((countSec) => countSec - 1);
      }
    }, 1000);
    return () => clearInterval(countDown);
  }, [countSec]);

  return (
    <p className="countSec">{ formatCountSec(countSec) }</p>
  );
};

const OTPValidate = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    otpCode: yup
      .string()
      .required('請輸入 OTP 驗證碼'),
    password: yup
      .string()
      .required('請輸入網銀密碼'),
  });
  const {
    handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const history = useHistory();
  const [showResultDialog, setShowResultDialog] = useState(false);

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    setShowResultDialog(true);
  };

  const handleAdjustmentFinish = () => {
    setShowResultDialog(false);
    history.push('/adjustment');
  };

  const ResultDialog = () => (
    <Dialog
      isOpen={showResultDialog}
      onClose={() => setShowResultDialog(false)}
      content={(
        <>
          <Alert state="success">申請成功</Alert>
          <p>
            您已成功申請額度臨調變更！
          </p>
        </>
      )}
      action={(
        <FEIBButton onClick={handleAdjustmentFinish}>
          確定
        </FEIBButton>
      )}
    />
  );

  return (
    <AdjustmentWrapper style={{ marginTop: '0' }}>
      <div className="countDownCard">
        <div className="countDownLabel">時間倒數</div>
        <div className="countDownInfo">
          <CountDown />
          <FEIBButton
            className="getNewOTP"
            $color={theme.colors.primary.dark}
            $borderColor="#DBE1F0"
            $bgColor="#DBE1F0"
          >
            重新寄驗證碼
          </FEIBButton>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="inputContainer">
          <FEIBInputLabel>OTP 驗證碼</FEIBInputLabel>
          <Controller
            name="otpCode"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <FEIBInput
                {...field}
                type="text"
                id="otpCode"
                name="otpCode"
                placeholder="請輸入 OTP 驗證碼"
                error={!!errors.otpCode}
              />
            )}
          />
          <FEIBErrorMessage>{errors.otpCode?.message}</FEIBErrorMessage>
        </div>
        <div className="inputContainer">
          <PasswordInput
            label="網銀密碼"
            id="password"
            name="password"
            placeholder="請輸入網銀密碼"
            control={control}
            errorMessage={errors.password?.message}
          />
        </div>
        <FEIBButton
          type="submit"
        >
          確認申請
        </FEIBButton>
      </form>
      {/* <ConfirmDialog /> */}
      <ResultDialog />
    </AdjustmentWrapper>
  );
};

export default OTPValidate;
