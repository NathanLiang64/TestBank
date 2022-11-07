/* eslint-disable no-unused-vars */

import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useController, useForm } from 'react-hook-form';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBInputLabel, FEIBInput, FEIBButton, FEIBRadio, FEIBRadioLabel, FEIBErrorMessage,
} from 'components/elements';
import { showCustomPrompt, showError } from 'utilities/MessageModal';
import Accordion from 'components/Accordion';
import { RadioGroup } from '@material-ui/core';
import { goHome, transactionAuth } from 'utilities/AppScriptProxy';
import A00800AccoridonContent from './A00800_AccoridonContent';

/* Styles */
import A00800Wrapper from './A00800.style';
import { memberRegister } from './api';

/**
 * A00800 訪客註冊
 */

const A00800 = () => {
  const [isOtpPass, setIsOtpPass] = useState(false);
  const [inviteToken, setInviteToken] = useState('');
  const authCode = 0x03;

  // 驗證錯誤文字
  const mobileError = (isEmpty) => `請輸入${!isEmpty && '正確的'}手機號碼`;
  const nameError = (isEmpty) => (isEmpty ? '請輸入姓名' : '姓名請勿超過5字元');
  const emailError = (isEmpty) => (isEmpty ? '請輸入Email' : '電子郵件請勿超過40字元');
  const emailFormatError = '請輸入正確的Email';
  const passwordError = (isEmpty) => (isEmpty ? '請輸入密碼' : '請輸入6位數字密碼');
  const passwordConfirmError = (isEmpty) => (isEmpty ? '請再次輸入密碼' : '密碼與確認密碼不相符');
  const termConfirmError = '請閱讀並同意使用條款';

  /**
   * 資料驗證
   */
  const mobileVerifySchema = yup.object().shape({
    mobileNum: yup.string().min(10, mobileError(false)).max(10, mobileError(false)).required(mobileError(true)),
  });
  const schema = yup.object().shape({
    name: yup.string().max(40, nameError(false)).required(nameError(true)),
    email: yup.string().max(40, emailError(false)).email(emailFormatError).required(emailError(true)),
    password: yup.string().min(6, passwordError(false)).max(6, passwordError(false)).required(passwordError(true)),
    passwordConfirm: yup.string().oneOf([yup.ref('password'), null], passwordConfirmError(false)).required(passwordConfirmError(true)),
    agreeTerms: yup.string().required(termConfirmError),
  });

  const { control: controlMobile, handleSubmit: handleSubmitMobile} = useForm({
    defaultValues: {
      mobileNum: '',
    },
    resolver: yupResolver(mobileVerifySchema),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      agreeTerms: 'false',
    },
    resolver: yupResolver(schema),
  });

  /* input物件 */
  const renderPhoneFormItem = () => {
    const {field, fieldState} = useController({name: 'mobileNum', control: controlMobile});

    return (
      <div className="form_item">
        <FEIBInputLabel>手機號碼</FEIBInputLabel>
        <div className="form_item_input">
          <FEIBInput {...field} />
          {fieldState.invalid && <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage> }
        </div>
      </div>
    );
  };
  const renderFormItem = ({
    label, areaName, type, isTerm, placeHolder,
  }) => {
    const { field, fieldState } = useController({name: areaName, control });

    return (
      <>
        {isTerm ? (
          <RadioGroup {...field} value={field.value}>
            <FEIBRadioLabel value="true" control={<FEIBRadio />} label="本人已閱讀並同意上述條款" />
          </RadioGroup>
        ) : (
          <div className="form_item">
            <FEIBInputLabel>{label}</FEIBInputLabel>
            <div className="form_item_input">
              <FEIBInput {...field} type={type} placeholder={placeHolder} />
            </div>
          </div>
        )}
        {fieldState.invalid && <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage> }
      </>
    );
  };

  /* OTP驗證電話號碼 */
  const handleVerifyMobileNum = async (data) => {
    console.log('A00800 handleVerifyMobileNum', {data});
    const result = await transactionAuth(authCode, data.mobileNum);
    console.log('A00800 handleVerifyMobileNum', {result});

    setIsOtpPass(result.result === true);
  };

  /* 註冊成功後跳轉 */
  const handleSwitchPage = () => {
    console.log('A00800');
    if (inviteToken !== '') {
      // TODO: 跳轉至邀請卡
      return '';
    }

    return goHome();
  };

  /* submit動作處理 */
  const onSubmit = async (data) => {
    console.log('A00800 handleOnSubmit() data:', {data, isOtpPass});
    const regData = {
      name: data.name,
      email: data.email,
      passwd: data.password,
    };

    if (!isOtpPass) {
      showCustomPrompt({title: '請先進行手機號碼驗證'});
      return;
    }

    const result = await memberRegister(regData);

    if (result.code !== '0000') {
      showCustomPrompt({title: '註冊失敗！'});
    }
    /* 註冊成功：進入首頁 */
    showCustomPrompt({
      title: '註冊成功！',
      onOk: () => handleSwitchPage(),
      onClose: () => handleSwitchPage(),
    });
  };

  useEffect(async () => {
    // TODO: 取得inviteToken(若有)
  }, []);

  return (
    <Layout title="訪客註冊" goHome={false}>
      <A00800Wrapper className="NonmemberWrapper">
        <div className="phone_input">
          <form onSubmit={handleSubmitMobile((data) => handleVerifyMobileNum(data))}>
            {renderPhoneFormItem()}
            <div className="phone_input_send">
              <FEIBButton $width={11} $height={3.2} type="submit">傳送驗證碼</FEIBButton>
            </div>
          </form>
        </div>
        <form className="basic_data_form" onSubmit={handleSubmit((data) => onSubmit(data))}>
          {renderFormItem({label: '姓名', areaName: 'name', type: 'text'})}
          {renderFormItem({label: 'E-mail', areaName: 'email', type: 'email'})}
          {renderFormItem({
            label: '密碼', areaName: 'password', type: 'password', placeHolder: '六位數字',
          })}
          {renderFormItem({label: '確認密碼', areaName: 'passwordConfirm', type: 'password'})}

          <Accordion space="top" title="個資保護法公告內容" className="accordion">
            <A00800AccoridonContent />
          </Accordion>
          <div className="term_agree">
            {renderFormItem({areaName: 'agreeTerms', isTerm: true})}
          </div>

          <FEIBButton className="form_button" type="submit">確定</FEIBButton>
        </form>
      </A00800Wrapper>
    </Layout>
  );
};

export default A00800;
