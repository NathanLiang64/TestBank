/* eslint-disable no-unused-vars */

import * as yup from 'yup';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useController, useForm } from 'react-hook-form';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBInputLabel, FEIBInput, FEIBButton, FEIBRadio, FEIBRadioLabel, FEIBErrorMessage,
} from 'components/elements';
import { showError, showInfo } from 'utilities/MessageModal';
import Accordion from 'components/Accordion';
import { RadioGroup } from '@material-ui/core';
import A00800AccoridonContent from './A00800_AccoridonContent';

/* Styles */
import A00800Wrapper from './A00800.style';
import { getOtp } from './api';

/**
 * A00800 訪客註冊
 */

const A00800 = () => {
  const [isOtpPass, setIsOtpPass] = useState(false);

  /**
   * 資料驗證
   */
  const mobileVerifySchema = yup.object().shape({
    mobileNum: yup.string().min(10, '請輸入正確的手機號碼').max(10, '請輸入正確的手機號碼').required('請輸入手機號碼'),
  });
  const schema = yup.object().shape({
    name: yup.string().required('請輸入姓名'),
    email: yup.string().email('請輸入正確的Email').required('請輸入Email'),
    password: yup.string().min(6, '請輸入6位數字密碼').max(6, '請輸入6位數字密碼').required('請輸入密碼'),
    passwordConfirm: yup.string().oneOf([yup.ref('password'), null], '密碼與確認密碼不相符').required('請再次輸入密碼'),
    agreeTerms: yup.string().required('請閱讀並同意使用條款'),
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
    label, areaName, type, isTerm,
  }) => {
    const { field, fieldState } = useController({name: areaName, control });
    // console.log('A00800 renderFormItem() label: ', {
    //   label, areaName, field, fieldState,
    // });

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
              <FEIBInput {...field} type={type} />
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
    const result = await getOtp(data);
    // console.log('A00800 handleVerifyMobileNum', {result});

    setIsOtpPass(result.result === true);
  };

  /* submit動作處理 */
  const onSubmit = (data) => {
    console.log('A00800 handleOnSubmit() data:', data);

    if (!isOtpPass) {
      showError('請先進行OTP驗證');
      return;
    }

    showInfo('註冊成功！');
  };

  return (
    <Layout title="訪客註冊">
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
          {renderFormItem({label: '密碼', areaName: 'password', type: 'password'})}
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
