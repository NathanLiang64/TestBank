import theme from 'themes/theme';
import { FEIBButton, FEIBInput } from 'components/elements';
import BottomDrawer from 'components/BottomDrawer';
import EmailConfirmWrapper from './emailVerification.style';

const EmailVerification = ({
  email, handleConfirm, sendEmail, goBack,
}) => (
  <BottomDrawer
    title="電子信箱驗證"
    isOpen
    noScrollable
    content={(
      <EmailConfirmWrapper>
        <div className="page_container">
          <div>您的電子信箱驗證信已發送至</div>

          <FEIBInput
            value={email}
            $color={theme.colors.text.mediumGray}
            $fontSize={1.4}
            $space="both"
            className="email_showcase"
            $icon="重新發送"
            $iconFontSize={1}
            $iconOnClick={() => sendEmail()}
          />

          <div>
            請您在電子郵件 email
            驗證信中點選連結確認，再回到本頁點選下方「已完成驗證」繼續完成申請。
          </div>

          <ol className="footer_text">
            <li>若您未收到電子信箱驗證信，請優先查看垃圾郵件資料夾，或稍後等待電子信件送達，或重新輸入其他電子信箱。</li>
            <li>您的申請於連結驗證完成後始生效力，若未完成驗證，本行將以您原留存本行之電子信箱進行各項通知、廣告函寄及電子對帳單寄送。</li>
          </ol>

          <div className="btn_container">
            <FEIBButton
              $color={theme.colors.text.dark}
              $bgColor={theme.colors.background.cancel}
              $width={15}
              onClick={goBack}
            >
              重新輸入
            </FEIBButton>
            <FEIBButton $width={15} onClick={handleConfirm}>已完成驗證</FEIBButton>
          </div>
        </div>
      </EmailConfirmWrapper>
    )}
  />
);

export default EmailVerification;
