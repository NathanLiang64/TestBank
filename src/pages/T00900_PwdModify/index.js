/* eslint-disable no-unused-vars */
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { changePwd } from 'pages/T00900_PwdModify/api';
import { closeFunc, switchLoading, transactionAuth } from 'utilities/AppScriptProxy';
import { showAnimationModal } from 'utilities/MessageModal';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBButton,
} from 'components/elements';
import PasswordInput from 'components/PasswordInput';
import e2ee from 'utilities/E2ee';
import { confirmPasswordValidation, newPasswordValidation, passwordValidation } from 'utilities/validation';

/* Styles */
// import theme from 'themes/theme';
import PwdModifyWrapper from './pwdModify.style';

const PwdModify = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    password: yup.string().required('請輸入您的網銀密碼'),
    newPassword: newPasswordValidation('password'),
    newPasswordCheck: confirmPasswordValidation('newPassword'),
  });
  const {
    handleSubmit, control, formState: { errors }, getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 設定結果彈窗
  const setResultDialog = (response) => {
    showAnimationModal({
      isSuccess: response,
      successTitle: '設定成功',
      successDesc: (
        <>
          <p>您的網銀密碼已變更成功囉！</p>
          <p>下次請使用新設定之密碼進行登入</p>
        </>
      ),
      errorTitle: '設定失敗',
      errorCode: '',
      errorDesc: '',
      onClose: () => closeFunc(),
    });
  };

  // 呼叫變更網銀密碼 API
  const handlePwdModify = async () => {
    const authCode = 0x28;
    const jsRs = await transactionAuth(authCode);
    if (jsRs.result) {
      switchLoading(true);
      const param = {
        password: e2ee(getValues('password')),
        newPassword: e2ee(getValues('newPassword')),
        newPasswordCheck: e2ee(getValues('newPasswordCheck')),
        actionCode: 1,
      };
      const changePwdResponse = await changePwd(param);
      setResultDialog(changePwdResponse);
      switchLoading(false);
    }
  };

  // 點擊儲存變更按鈕，表單驗證
  const onSubmit = async () => {
    handlePwdModify();
  };

  return (
    <Layout title="網銀密碼變更">
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
      </PwdModifyWrapper>
    </Layout>
  );
};

export default PwdModify;
