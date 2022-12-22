import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { changePwd } from 'pages/T00900_PwdModify/api';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { showAnimationModal } from 'utilities/MessageModal';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import e2ee from 'utilities/E2ee';

import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { PasswordInputField } from 'components/Fields';
import { AuthCode } from 'utilities/TxnAuthCode';
import { useNavigation } from 'hooks/useNavigation';
import PwdModifyWrapper from './T00900.style';
import { validationSchema } from './validationSchema';

const PwdModify = () => {
  const dispatch = useDispatch();
  const { closeFunc } = useNavigation();
  const {handleSubmit, control } = useForm({
    defaultValues: {
      password: '',
      newPassword: '',
      newPasswordCheck: '',
    },
    resolver: yupResolver(validationSchema),
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
  const handlePwdModify = async ({password, newPassword, newPasswordCheck}) => {
    const jsRs = await transactionAuth(AuthCode.T00900);
    if (jsRs.result) {
      dispatch(setWaittingVisible(true));
      const param = {
        password: e2ee(password),
        newPassword: e2ee(newPassword),
        newPasswordCheck: e2ee(newPasswordCheck),
        actionCode: 1,
      };
      const changePwdResponse = await changePwd(param);
      dispatch(setWaittingVisible(false));
      setResultDialog(changePwdResponse);
    }
  };

  // 點擊儲存變更按鈕，表單驗證
  const onSubmit = async (values) => {
    handlePwdModify(values);
  };

  return (
    <Layout title="網銀密碼變更">
      <PwdModifyWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <PasswordInputField
              labelName="您的網銀密碼"
              name="password"
              control={control}
            />
            <PasswordInputField
              labelName="新的網銀密碼"
              name="newPassword"
              control={control}
            />
            <PasswordInputField
              labelName="請確認新的網銀密碼"
              name="newPasswordCheck"
              control={control}
            />
          </div>
          <FEIBButton type="submit">儲存變更</FEIBButton>
        </form>
      </PwdModifyWrapper>
    </Layout>
  );
};

export default PwdModify;
