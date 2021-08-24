/* eslint-disable */

import { useSelector, useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BottomDrawer from 'components/BottomDrawer';
import {
  FEIBButton, FEIBErrorMessage, FEIBInput, FEIBInputLabel,
} from 'components/elements';
import PasswordInput from 'components/PasswordInput';
import CountDown from 'components/CountDown';
import { otpCodeValidation, passwordValidation } from 'utilities/validation';
// import theme from 'themes/theme';
import { useEffect, useState } from 'react';
import { setIsPasswordRequired, setResult } from './stores/actions';
import PasswordDrawerWrapper from './passwordDrawer.style';

// TODO: trying refactor (using custom hook to check)
const PasswordDrawer = () => {
  const schema = yup.object().shape({
    otpCode: otpCodeValidation(),
    ...passwordValidation,
  });
  const { handleSubmit, control, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const isPasswordRequired = useSelector(({ passwordDrawer }) => passwordDrawer.isPasswordRequired);
  const fastLogin = useSelector(({ passwordDrawer }) => passwordDrawer.fastLogin);
  const motp = useSelector(({ passwordDrawer }) => passwordDrawer.motp);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [replayCountDown, setReplayCountDown] = useState(false);

  const dispatch = useDispatch();

  const handleClickResendButton = () => {
    setResendDisabled(true);
    setReplayCountDown(true);
    // call otp api
  };

  const handleClickSubmit = (data) => {
    // 假設 1qaz2wsx 是用戶密碼，輸入正確才可通過
    if (data.password === '1qaz2wsx') {
      dispatch(setResult(true));
      // dispatch(setFastLogin(false));
      dispatch(setIsPasswordRequired(false));
    } else {
      // console.log('不通過');
      dispatch(setResult(false));
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setReplayCountDown(false), 1000);
    return () => clearInterval(timer);
  }, [replayCountDown]);

  const renderOTPArea = () => (
    <div>
      <div className="countDownArea">
        <div className="countDown">
          <p>時間倒數</p>
          <CountDown onEnd={() => setResendDisabled(false)} replay={replayCountDown} />
        </div>
        <FEIBButton
          className="resendButton"
          disabled={resendDisabled}
          onClick={handleClickResendButton}
        >
          重新寄驗證碼
        </FEIBButton>
      </div>
      <FEIBInputLabel>一次性 OTP 驗證</FEIBInputLabel>
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
            placeholder="請輸入驗證碼"
            error={!!errors.otpCode}
            startAdornment={<p className="prefixCode">R5BG</p>}
          />
        )}
      />
      <FEIBErrorMessage>{errors.otpCode?.message}</FEIBErrorMessage>
    </div>
  );

  const renderPasswordArea = () => (
    <PasswordInput
      id="password"
      name="password"
      control={control}
      errorMessage={errors.password?.message}
    />
  );

  return (
    <BottomDrawer
      title="輸入網銀密碼"
      isOpen={isPasswordRequired}
      onClose={() => dispatch(setIsPasswordRequired(false))}
      content={(
        <PasswordDrawerWrapper>
          <form onSubmit={handleSubmit(handleClickSubmit)}>
            { !motp && renderOTPArea() }
            { fastLogin && renderPasswordArea() }
            <FEIBButton type="submit">送出</FEIBButton>
          </form>
        </PasswordDrawerWrapper>
      )}
    />
  );
};

export default PasswordDrawer;
