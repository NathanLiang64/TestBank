/* eslint-disable no-unused-vars */
import { FEIBButton, FEIBInput } from 'components/elements';
import Layout from 'components/Layout/Layout';
import { useHistory } from 'react-router';
import theme from 'themes/theme';

/* style */
import EmailConfirmWrapper from './emailVerification.style';

const EmailConfirm = (email) => {
  console.log('EmailConfirm', {email});
  const history = useHistory();

  const handleReSend = () => {
    console.log('EmailConfirm handleReSend', {email});
  };

  const handleConfirm = () => {
    console.log('EmailConfirm handleConfirm', {email});
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <EmailConfirmWrapper>
      <Layout title="電子郵件 email驗證" goHome={false} goBackFunc={goBack}>
        <div className="page_container">
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

export default EmailConfirm;
