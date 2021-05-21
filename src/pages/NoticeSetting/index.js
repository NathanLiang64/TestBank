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
import Dialog from 'components/Dialog';
import NoticeArea from 'components/NoticeArea';

/* Styles */
import theme from 'themes/theme';
import NoticeSettingWrapper from './noticeSetting.style';

const NoticeSetting = () => {
  const history = useHistory();
  const [openDialog, setOpenDialog] = useState(false);
  const [activeNotice, setActiveNotice] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const handleToggleDialog = (bool) => {
    setOpenDialog(bool);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCheckBoxChange = (event) => {
    setAgree(event.target.checked);
  };

  const activateNotice = () => {
    if (!activeNotice) {
      setDialogContent('請啟用訊息通知');
      setOpenDialog(true);
      return;
    }
    if (!agree) {
      setDialogContent('請閱讀並同意訊息通知使用條款');
      setOpenDialog(true);
      return;
    }
    if (!password) {
      setDialogContent('請輸入網銀密碼');
      setOpenDialog(true);
      return;
    }
    history.push('/noticeSetting2');
  };

  useCheckLocation();
  usePageInfo('/api/noticeSetting');

  return (
    <NoticeSettingWrapper>
      <div className="noticeContainer all full">
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
        />
      </div>
      <NoticeArea title="訊息通知使用條款" textAlign="left">
        <p>1. 顯示相關條款文案。</p>
        <p>2. 顯示相關條款文案。</p>
        <p>3. 顯示相關條款文案。</p>
        <p>4. 顯示相關條款文案。</p>
        <p>5. 顯示相關條款文案。</p>
        <p>6. 顯示相關條款文案。</p>
        <p>7. 顯示相關條款文案。</p>
        <p>7. 顯示相關條款文案。</p>
        <p>7. 顯示相關條款文案。</p>
        <p>7. 顯示相關條款文案。</p>
        <p>7. 顯示相關條款文案。</p>
        <p>7. 顯示相關條款文案。</p>
        <p>7. 顯示相關條款文案。</p>
        <p>7. 顯示相關條款文案。</p>
        <p>7. 顯示相關條款文案。</p>
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
        label="本人已閱讀並同意上述訊息通知使用條款"
        $color={theme.colors.primary.brand}
      />
      <FEIBInputLabel $color={theme.colors.primary.brand} style={{ marginTop: '2rem' }}>網銀密碼</FEIBInputLabel>
      <FEIBInput
        type="password"
        name="password"
        value={password}
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
        onChange={handlePasswordChange}
      />
      <FEIBButton onClick={activateNotice}>
        儲存變更
      </FEIBButton>
      <Dialog
        isOpen={openDialog}
        onClose={() => handleToggleDialog(false)}
        content={dialogContent}
        action={(
          <FEIBButton onClick={() => handleToggleDialog(false)}>
            確定
          </FEIBButton>
        )}
      />
    </NoticeSettingWrapper>
  );
};

export default NoticeSetting;
