import { useState } from 'react';
// import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBInput, FEIBInputLabel, FEIBButton,
} from 'components/elements';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';
import Alert from 'components/Alert';

/* Styles */
import theme from 'themes/theme';
import ChangeUserNameWrapper from './changeUserName.style';

const ChangeUserName = () => {
  // const history = useHistory();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [form, setForm] = useState({
    userName: '',
    newUserName: '',
    newUserNameCheck: '',
    password: '',
  });

  const handleFormChange = ({ target }) => {
    const formObject = { ...form };
    formObject[target.name] = target.value;
    setForm({ ...formObject });
  };

  const handleChangeUserName = () => {
    setShowConfirmDialog(false);
    setShowResultDialog(true);
  };

  const handleResultButton = () => {
    setShowResultDialog(false);
  };

  const ConfirmDialog = () => (
    <Dialog
      isOpen={showConfirmDialog}
      onClose={() => setShowConfirmDialog(false)}
      content={<p>您確定要變更使用者代號嗎？</p>}
      action={(
        <ConfirmButtons
          mainButtonOnClick={handleChangeUserName}
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
            您的使用者代號已變更成功囉！
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
  usePageInfo('/api/changeUserName');

  return (
    <ChangeUserNameWrapper>
      <FEIBInputLabel>您的使用者代號</FEIBInputLabel>
      <FEIBInput
        type="text"
        name="userName"
        value={form.userName}
        placeholder="請輸入6~20位英數字，英文字區分大小寫"
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
        onChange={handleFormChange}
      />
      <FEIBInputLabel>新的使用者代號</FEIBInputLabel>
      <FEIBInput
        type="text"
        name="newUserName"
        value={form.newUserName}
        placeholder="請輸入6~20位英數字，英文字區分大小寫"
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
        onChange={handleFormChange}
      />
      <FEIBInputLabel>請確認新的使用者代號</FEIBInputLabel>
      <FEIBInput
        type="text"
        name="newUserNameCheck"
        value={form.newUserNameCheck}
        placeholder="請再輸入一次新的使用者代號"
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
        onChange={handleFormChange}
      />
      <FEIBInputLabel>請輸入網銀密碼</FEIBInputLabel>
      <FEIBInput
        type="password"
        name="password"
        value={form.password}
        placeholder="請輸入有區分大小寫的8~20位英數字網銀密碼"
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
        onChange={handleFormChange}
      />
      <FEIBButton
        disabled={
          !form.userName
          || !form.newUserName
          || !form.newUserNameCheck
          || !form.password
          || (form.newUserName !== form.newUserNameCheck)
        }
        onClick={() => setShowConfirmDialog(true)}
      >
        儲存變更
      </FEIBButton>
      <ConfirmDialog />
      <ResultDialog />
    </ChangeUserNameWrapper>
  );
};

export default ChangeUserName;
