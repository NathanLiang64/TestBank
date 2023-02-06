import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { changePwd } from 'pages/T00900_PwdModify/api';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { showAnimationModal } from 'utilities/MessageModal';
import { Func } from 'utilities/FuncID';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import e2ee from 'utilities/E2ee';

import { PasswordInputField } from 'components/Fields';
import { useNavigation } from 'hooks/useNavigation';
import PwdModifyWrapper from './T00900.style';
import { validationSchema } from './validationSchema';

const PwdModify = () => {
  const placeholderText = '請輸入網銀密碼（8-20位英數字）';
  const { closeFunc } = useNavigation();
  const {handleSubmit, control } = useForm({
    defaultValues: { password: '', newPassword: '', newPasswordCheck: '' },
    resolver: yupResolver(validationSchema),
  });

  // 點擊儲存變更按鈕，表單驗證
  const onSubmit = async ({ password, newPassword }) => {
    const jsRs = await transactionAuth(Func.T00900.authCode);
    if (jsRs.result) {
      const param = {
        password: e2ee(password),
        newPassword: e2ee(newPassword),
      };
      const { isSuccess, code, message } = await changePwd(param);

      showAnimationModal({
        isSuccess,
        successTitle: '設定成功',
        successDesc: (
          <>
            <p>您的網銀密碼已變更成功囉！</p>
            <p>下次請使用新設定之密碼進行登入</p>
          </>
        ),
        errorTitle: '設定失敗',
        errorCode: code,
        errorDesc: message,
        onClose: closeFunc,
      });
    }
  };

  return (
    <Layout title="網銀密碼變更">
      <PwdModifyWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <PasswordInputField
            labelName="您的網銀密碼"
            name="password"
            control={control}
            inputProps={{autoComplete: 'off', placeholder: placeholderText, maxLength: 20}}
          />
          <PasswordInputField
            labelName="新的網銀密碼"
            name="newPassword"
            control={control}
            inputProps={{autoComplete: 'off', placeholder: placeholderText, maxLength: 20}}
          />
          <PasswordInputField
            labelName="請確認新的網銀密碼"
            name="newPasswordCheck"
            control={control}
            inputProps={{autoComplete: 'off', placeholder: placeholderText, maxLength: 20}}
          />
          <FEIBButton type="submit">儲存變更</FEIBButton>
        </form>
      </PwdModifyWrapper>
    </Layout>
  );
};

export default PwdModify;
