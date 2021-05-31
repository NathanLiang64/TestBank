import { useState } from 'react';
// import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import PasswordInput from 'components/PasswordInput';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';
import Alert from 'components/Alert';

/* Styles */
// import theme from 'themes/theme';
import PwdModifyWrapper from './pwdModify.style';

const PwdModify = () => {
  const forceModify = false;
  const [form, setForm] = useState({
    password: '',
    newPassword: '',
    newPasswordCheck: '',
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  const handleFormChange = ({ target }) => {
    const formObject = { ...form };
    formObject[target.name] = target.value;
    setForm({ ...formObject });
  };

  const handlePasswordModify = () => {
    setShowConfirmDialog(false);
    setShowResultDialog(true);
  };

  const handleResultButton = () => {
    setShowResultDialog(false);
  };

  const WarningDialog = () => (
    <Dialog
      isOpen={showWarningDialog}
      onClose={() => setShowWarningDialog(false)}
      content={(
        <>
          <p>您確定不要變更網銀密碼嗎？</p>
          <p>久未更新網銀密碼可能會有...風險</p>
        </>
      )}
      action={(
        <ConfirmButtons
          mainButtonOnClick={() => setShowWarningDialog(false)}
          subButtonOnClick={() => setShowWarningDialog(false)}
        />
      )}
    />
  );

  const ConfirmDialog = () => (
    <Dialog
      isOpen={showConfirmDialog}
      onClose={() => setShowConfirmDialog(false)}
      content={<p>您確定要變更網銀密碼嗎？</p>}
      action={(
        <ConfirmButtons
          mainButtonOnClick={handlePasswordModify}
          subButtonOnClick={() => setShowConfirmDialog(false)}
        />
      )}
    />
  );

  const ResultDialog = () => (
    <Dialog
      isOpen={showResultDialog}
      onClose={() => setShowResultDialog(false)}
      content={(
        <>
          <Alert state="success">變更成功</Alert>
          <p>
            您的網銀密碼已變更成功囉！
          </p>
          <p>
            下次請使用新設定之密碼進行登入，謝謝。
          </p>
        </>
      )}
      action={(
        <FEIBButton onClick={handleResultButton}>
          確定
        </FEIBButton>
      )}
    />
  );

  useCheckLocation();
  usePageInfo('/api/pwdModify');

  return (
    <PwdModifyWrapper>
      <PasswordInput
        label="您的網銀密碼"
        id="password"
        name="password"
        value={form.password}
        placeholder="請輸入有區分大小寫的8~20位英數字網銀密碼"
        onChange={handleFormChange}
      />
      <PasswordInput
        label="新的網銀密碼"
        id="newPassword"
        name="newPassword"
        value={form.newPassword}
        placeholder="請輸入有區分大小寫的8~20位英數字網銀密碼"
        onChange={handleFormChange}
      />
      <PasswordInput
        label="請確認新的網銀密碼"
        id="newPasswordCheck"
        name="newPasswordCheck"
        value={form.newPasswordCheck}
        placeholder="請輸入有區分大小寫的8~20位英數字網銀密碼"
        onChange={handleFormChange}
      />
      {
        forceModify ? (
          <ConfirmButtons
            subButtonValue="維持不變"
            mainButtonValue="儲存變更"
            mainButtonDisabled={
              !form.password
              || !form.newPassword
              || !form.newPasswordCheck
              || (form.newPassword !== form.newPasswordCheck)
            }
            mainButtonOnClick={() => setShowConfirmDialog(true)}
            subButtonOnClick={() => setShowWarningDialog(true)}
          />
        ) : (
          <FEIBButton
            disabled={
              !form.password
              || !form.newPassword
              || !form.newPasswordCheck
              || (form.newPassword !== form.newPasswordCheck)
            }
            onClick={() => setShowConfirmDialog(true)}
          >
            儲存變更
          </FEIBButton>
        )
      }
      <WarningDialog />
      <ConfirmDialog />
      <ResultDialog />
    </PwdModifyWrapper>
  );
};

export default PwdModify;
