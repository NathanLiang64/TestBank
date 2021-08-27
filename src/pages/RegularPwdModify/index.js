import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { goToFunc } from 'utilities/BankeePlus';
import { pwdModifyApi } from 'apis';

/* Elements */
import PasswordInput from 'components/PasswordInput';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';
import InfoArea from 'components/InfoArea';
import { passwordValidation } from 'utilities/validation';
import e2ee from 'utilities/E2ee';

/* Styles */
// import theme from 'themes/theme';
import RegularPwdModifyWrapper from './regularPwdModify.style';

const RegularPwdModify = () => {
  const history = useHistory();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    ...passwordValidation,
    newPassword: passwordValidation.password,
    newPasswordCheck: yup
      .string()
      .required('請再輸入一次新網銀密碼')
      .oneOf([yup.ref('newPassword'), null], '必須與新網銀密碼相同'),
  });
  const {
    handleSubmit, control, formState: { errors }, getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  // 跳轉結果頁
  const toResultPage = (data) => {
    history.push('/regularPwdModify1', { data });
  };

  // 呼叫變更網銀密碼API
  const handlePasswordModify = async () => {
    const param = {
      password: await e2ee(getValues('password')),
      newPassword: await e2ee(getValues('newPassword')),
      newPasswordCheck: await e2ee(getValues('newPasswordCheck')),
    };
    const changePwdResponse = await pwdModifyApi.changePwd(param);
    console.log('變更網銀密碼回傳', changePwdResponse);
    const data = 'custName' in changePwdResponse;
    toResultPage(data);
    setShowConfirmDialog(false);
  };

  const handleWarnConfirm = () => {
    setShowWarningDialog(false);
    goToFunc('home');
  };

  const onSubmit = async () => {
    setShowConfirmDialog(true);
  };

  const WarningDialog = () => (
    <Dialog
      isOpen={showWarningDialog}
      onClose={() => setShowWarningDialog(false)}
      content={(
        <>
          <p>您確定不要變更網銀密碼嗎？</p>
          <p>久未更新網銀密碼可能會有安全性風險</p>
        </>
      )}
      action={(
        <ConfirmButtons
          mainButtonOnClick={handleWarnConfirm}
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

  useCheckLocation();
  usePageInfo('/api/regularPwdModify');

  return (
    <RegularPwdModifyWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <PasswordInput
            label="您的網銀密碼"
            id="password"
            name="password"
            control={control}
            errorMessage={errors.password?.message}
          />
          <PasswordInput
            label="新的網銀密碼"
            id="newPassword"
            name="newPassword"
            control={control}
            errorMessage={errors.newPassword?.message}
          />
          <PasswordInput
            label="請確認新的網銀密碼"
            id="newPasswordCheck"
            name="newPasswordCheck"
            control={control}
            errorMessage={errors.newPasswordCheck?.message}
          />
        </div>
        <div>
          <InfoArea space="bottom">
            *每六個月請進行密碼以及個資更新以確保帳號安全
          </InfoArea>
          <ConfirmButtons
            subButtonValue="維持不變"
            mainButtonValue="儲存變更"
            subButtonOnClick={(event) => {
              event.preventDefault();
              setShowWarningDialog(true);
            }}
          />
        </div>
      </form>
      <WarningDialog />
      <ConfirmDialog />
    </RegularPwdModifyWrapper>
  );
};

export default RegularPwdModify;
