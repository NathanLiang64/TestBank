/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import theme from 'themes/theme';
import { FEIBButton, FEIBInput } from 'components/elements';
import Layout from 'components/Layout/Layout';
import { showCustomPrompt } from 'utilities/MessageModal';
import { checkEmail } from './api';
import EmailConfirmWrapper from './emailVerification.style';

const EmailVerification = () => {
  const email = 'test@test.test';
  console.log('EmailVerification', {email});

  const [isRenderConfirm, setisRenderConfirm] = useState(false);
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  const handleReSend = () => {
    console.log('EmailConfirm handleReSend', {email});
  };

  const handleConfirm = () => {
    console.log('EmailConfirm handleConfirm', {email});
  };

  const handleEmailCheck = () => {
    console.log('EmailVerification handleEmailCheck');
    // call send eamil api
    // open EmailConfirm
    setisRenderConfirm(true);
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

  useEffect(async () => {
    const res = await checkEmail({email});
    await eamilCheckModal(res.data);
  }, []);

  return (
    <EmailConfirmWrapper>
      <Layout title="電子郵件 email驗證" goHome={false} goBackFunc={goBack}>
        <div className={isRenderConfirm ? 'page_container' : 'hide'}>
          <div className="header_text">
            您的
            <span className="highlight_text underline_text">電子郵件 email 驗證信</span>
            已發送至
          </div>

          <FEIBInput value={email} $color={theme.colors.text.mediumGray} $fontSize={1.4} $space="both" className="email_showcase" $icon="重新發送" $iconFontSize={1} $iconOnClick={handleReSend} />

          <div className="highlight_text">
            請您在電子郵件 email 驗證信中點選連結確認，再回到本頁點選下方「已完成驗證」繼續完成申請。
          </div>

          <div className="footer_text">
            請注意，若您未收到電子信箱驗證信，請優先查看垃圾郵件資料夾，或稍後等待電子信件送達，或重新輸入其他電子信箱。
          </div>

          <div className="btn_container">
            <FEIBButton
              className="btn btn_return"
              $color={theme.colors.text.dark}
              $bgColor={theme.colors.background.cancel}
              $width={15}
              onClick={goBack}
            >
              重新輸入
            </FEIBButton>
            <FEIBButton className="btn btn_confirm" $width={15} onClick={handleConfirm}>已完成驗證</FEIBButton>
          </div>
        </div>
      </Layout>
    </EmailConfirmWrapper>
  );
};

export default EmailVerification;
