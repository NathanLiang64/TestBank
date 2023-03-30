/* eslint-disable no-unused-vars */
import * as yup from 'yup';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBBorderButton, FEIBButton } from 'components/elements';
import { showAnimationModal, showCustomPrompt } from 'utilities/MessageModal';
import { TextInputField } from 'components/Fields';
import { Func } from 'utilities/FuncID';
import { useNavigation } from 'hooks/useNavigation';

import { PageWrapper } from './nonMemberForgotPassword.style';
import { getOtp, resetPassword } from './api';

const NonMemberForgetPassword = () => {
  const { closeFunc } = useNavigation();
  const [resetPasswordSteps, setResetPasswordSteps] = useState(1);
  const [otpData, setOtpData] = useState('');
  const mobileError = (isEmpty) => `請輸入${!isEmpty && '正確的'}手機號碼`;
  const passwordError = (isEmpty) => (isEmpty ? '請輸入密碼' : '請輸入6位數字密碼');
  const passwordConfirmError = (isEmpty) => (isEmpty ? '請再次輸入密碼' : '密碼與確認密碼不相符');

  // form: 取得otp
  const schema = yup.object().shape({
    mobileNum: yup.string().min(10, mobileError(false)).max(10, mobileError(false)).required(mobileError(true)),
  });
  const { control, getValues } = useForm({
    defaultValues: {
      mobileNum: '',
      otpCode: '',
    },
    resolver: yupResolver(schema),
  });

  // form: 輸入新密碼
  const schemaNewPassword = yup.object().shape({
    password: yup.string().min(6, passwordError(false)).max(6, passwordError(false)).required(passwordError(true)),
    passwordConfirm: yup.string().oneOf([yup.ref('password'), null], passwordConfirmError(false)).required(passwordConfirmError(true)),
  });
  const {control: newPwdControl, handleSubmit} = useForm({
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
    resolver: yupResolver(schemaNewPassword),
  });

  const sendOtp = () => {
    const phoneNumber = getValues('mobileNum');
    const response = getOtp(phoneNumber);

    setOtpData(response);
  };

  const onVerifyOtp = async () => {
    const otpCode = await getValues('otpCode');
    console.log('onSubmit', {otpCode});

    if (otpCode === otpData.otpCode) {
      // 驗證otp正確，開啟密碼設定頁
      setResetPasswordSteps(2);
    } else {
      console.log('otp錯誤');
      await showCustomPrompt({
        title: 'OTP輸入錯誤',
        message: '請重新輸入',
      });
    }
  };

  const onSubmit = async (data) => {
    console.log('onSubmit', {data});
    // API送出新密碼 & 成功/失敗畫面
    const response = await resetPassword(data.password);
    await showAnimationModal({
      isSuccess: response,
      successTitle: '重設成功',
      successDesc: '',
      errorTitle: '重設失敗',
      errorCode: '',
      errorDesc: '',
      onClose: () => {},
    });

    // TODO 回到登入頁
    // closeFunc();
  };

  return (
    // fid待確認
    <Layout fid={Func.A008} title="忘記密碼" goHome={false} goBackFunc={closeFunc}>
      <PageWrapper>
        {resetPasswordSteps === 1 && (
        <div className="form">
          <div className="phone_num_verify">
            <TextInputField labelName="手機號碼" type="tel" name="mobileNum" control={control} inputProps={{ inputMode: 'numeric' }} />
            <FEIBBorderButton onClick={sendOtp}>傳送驗證碼</FEIBBorderButton>
          </div>
          <TextInputField labelName="簡訊驗證碼" type="text" name="otpCode" control={control} inputProps={{ inputMode: 'numeric' }} />
          <div className="otp_code_identifier">
            <p>識別碼</p>
            <p>{otpData.otpId}</p>
          </div>
          <FEIBButton onClick={onVerifyOtp}>確定</FEIBButton>
        </div>
        )}

        {resetPasswordSteps === 2 && (
          <form className="form" onSubmit={handleSubmit((data) => onSubmit(data))}>
            <p>重設密碼</p>
            <TextInputField labelName="密碼" type="password" name="password" control={newPwdControl} inputProps={{ inputMode: 'numeric', placeholder: '六位數字' }} />
            <TextInputField labelName="確認密碼" type="password" name="passwordConfirm" control={newPwdControl} inputProps={{ inputMode: 'numeric', placeholder: '確認密碼' }} />
            <FEIBButton type="submit">確定</FEIBButton>
          </form>
        )}
      </PageWrapper>
    </Layout>
  );
};

export default NonMemberForgetPassword;
