import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { pwdModifyApi } from 'apis';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import PasswordInput from 'components/PasswordInput';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';
import e2ee from 'utilities/E2ee';
import { passwordValidation } from 'utilities/validation';

/* Styles */
// import theme from 'themes/theme';
import PwdModifyWrapper from './pwdModify.style';

const PwdModify = () => {
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

  // 跳轉結果頁
  const toResultPage = (data) => {
    history.push('/pwdModify1', { data });
  };

  // 呼叫變更網銀密碼 API
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

  // 點擊儲存變更按鈕，表單驗證
  const onSubmit = async () => {
    setShowConfirmDialog(true);
  };

  // 確認變更網銀密碼彈窗
  const ConfirmDialog = () => (
    <Dialog
      isOpen={showConfirmDialog}
      onClose={() => setShowConfirmDialog(false)}
      content={<p className="txtCenter">您確定要變更網銀密碼嗎？</p>}
      action={(
        <ConfirmButtons
          mainButtonOnClick={handlePasswordModify}
          subButtonOnClick={() => setShowConfirmDialog(false)}
        />
      )}
    />
  );

  useCheckLocation();
  usePageInfo('/api/pwdModify');

  return (
    <PwdModifyWrapper>
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
        <FEIBButton
          type="submit"
        >
          儲存變更
        </FEIBButton>
      </form>
      <ConfirmDialog />
    </PwdModifyWrapper>
  );
};

export default PwdModify;
