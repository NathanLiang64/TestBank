import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBSwitch,
  FEIBInputLabel,
  FEIBInput,
  FEIBButton,
  FEIBCheckboxLabel,
  FEIBCheckbox,
  FEIBSwitchLabel,
} from 'components/elements';
import NoticeArea from 'components/NoticeArea';

/* Styles */
import theme from 'themes/theme';
import NoticeSettingWrapper from './noticeSetting.style';

const NoticeSetting = () => {
  const history = useHistory();
  const [activeNotice, setActiveNotice] = useState(false);
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCheckBoxChange = (event) => {
    setAgree(event.target.checked);
  };

  const activateNotice = () => {
    history.push('/noticeSetting1');
  };

  useCheckLocation();
  usePageInfo('/api/noticeSetting');

  return (
    <NoticeSettingWrapper>
      <div className="noticeContainer all">
        <FEIBSwitchLabel
          control={
            (
              <FEIBSwitch
                onChange={() => {
                  setActiveNotice(!activeNotice);
                }}
                checked={activeNotice}
              />
            )
          }
          label="訊息通知啟用"
          $hasBorder
        />
      </div>
      <NoticeArea className="customNoticeArea" title="訊息通知使用條款" textAlign="left">
        <p>1. 本服務提供您設定各類訊息通知，讓您隨時接收個人帳務及專屬優惠訊息。</p>
        <p>2. 除您已設定之通知項目外，本行亦會將全行公告/優惠訊息透過訊息通知服務發送給您，以確保您的權益。</p>
        <p>3. 使用本服務前請先確認您的手機，「遠東商銀」APP的通知狀態已設定為開啟。</p>
        <p>4. 「訊息通知」服務受網路傳輸影響，無法保證一定送達。</p>
        <p>5. 本功能只提供本人之一台手機中設定，如於本人其他手機中設定，則原手機設定將自動解除。</p>
        <p>6. 手機重置或重新安裝APP時，需要重新設定本功能。</p>
        <p>
          7. 如您欲變更或取消「訊息通知」服務時，請至
          <span className="textColorPrimary">服務設定 ➝ 訊息通知設定/變更/取消</span>
          功能中進行設定。
        </p>
      </NoticeArea>
      <FEIBCheckboxLabel
        control={(
          <FEIBCheckbox
            color="default"
            $iconColor={theme.colors.primary.brand}
            onChange={handleCheckBoxChange}
            checked={agree}
          />
        )}
        label="本人已閱讀並同意上述[訊息通知]使用條款"
      />
      <FEIBInputLabel style={{ marginTop: '2rem' }}>網銀密碼</FEIBInputLabel>
      <FEIBInput
        type="password"
        name="password"
        value={password}
        placeholder="請輸入您的網銀密碼"
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
        onChange={handlePasswordChange}
      />
      <FEIBButton
        disabled={!activeNotice || !agree || !password}
        onClick={activateNotice}
      >
        確定
      </FEIBButton>
    </NoticeSettingWrapper>
  );
};

export default NoticeSetting;
