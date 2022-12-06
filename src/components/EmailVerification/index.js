/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { setModalVisible } from 'stores/reducers/ModalReducer';
import theme from 'themes/theme';
import { showCustomPrompt } from 'utilities/MessageModal';
import { checkEmail } from './api';
import EmailConfirm from './emailConfirm';

const emailVerification = async ({email = 'test@test.test'}) => {
  console.log('EmailVerification', {email});
  // const history = useHistory();

  const handleEmailCheck = () => {
    console.log('EmailVerification handleEmailCheck');
    // call send eamil api
    // history.push('/emailConfirm', {email});
  };

  const eamilCheckModal = async (data) => {
    console.log('EmailVerification eamilCheckModal', {data});

    switch (data.repeatedMember.length) {
      case 0:
        await showCustomPrompt({
          message: '依法規規定，我們需對您填寫的電子郵件 email進行驗證確認。',
          okContent: '發送確認信',
          onOk: () => handleEmailCheck(),
        });
        break;
      case 1:
      case 2:
        await showCustomPrompt({
          message: (
            <div>
              依法規規定，我們需對您填寫的電子郵件 email進行驗證確認，由於您填寫的電子信箱與本行客戶有相同情形，請您務必勾選實際原因，若您的原因不在預設的勾選項目中，
              <span style={{ color: theme.colors.text.point }}>
                請重輸入其他電子郵件 email
              </span>
              。
              {/* 重複名單列表 */}
            </div>),
          okContent: '發送確認信',
          cancelContent: '重新輸入',
          onOk: () => handleEmailCheck(),
        });
        break;
      default:
        await showCustomPrompt({
          message: (
            <p>
              依法規規定，我們需對您填寫的電子郵件 email進行驗證確認，由於您填寫的電子信箱與本行客戶有相同情形，為確保您的權益，
              <span style={{ color: theme.colors.text.point }}>請重輸入其他電子郵件 email</span>
              。
            </p>),
          okContent: '重新輸入',
        });
        break;
    }
  };

  const res = await checkEmail({email});
  await eamilCheckModal(res.data);
};

export default emailVerification;
