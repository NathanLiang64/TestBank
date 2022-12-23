import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { transactionAuth, closeFunc } from 'utilities/AppScriptProxy';
import { renewPwd } from 'pages/A00700_RegularPwdModify/api';
import { showCustomPrompt, showAnimationModal } from 'utilities/MessageModal';

/* Elements */
import Layout from 'components/Layout/Layout';
import ConfirmButtons from 'components/ConfirmButtons';
import InfoArea from 'components/InfoArea';
import e2ee from 'utilities/E2ee';

/* Styles */
import { AuthCode } from 'utilities/TxnAuthCode';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { PasswordInputField } from 'components/Fields';
import RegularPwdModifyWrapper from './regularPwdModify.style';
import { validationSchema } from './validationSchema';

const RegularPwdModify = () => {
  const dispatch = useDispatch();
  const { handleSubmit, control } = useForm({
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

  // 點擊儲存變更，呼叫更新網銀密碼API
  const onSubmit = async ({ password, newPassword, newPasswordCheck }) => {
    const jsRs = await transactionAuth(AuthCode.A00700);
    if (jsRs.result) {
      dispatch(setWaittingVisible(true));
      const param = {
        password: e2ee(password),
        newPassword: e2ee(newPassword),
        newPasswordCheck: e2ee(newPasswordCheck),
        actionCode: 1,
      };
      const response = await renewPwd(param);
      dispatch(setWaittingVisible(false));
      setResultDialog(response);
    }
  };

  // 不變更密碼，並且離開此頁面
  const remainSamePwd = async () => {
    await renewPwd({ actionCode: 2 });
    closeFunc();
  };

  useEffect(async () => {
    const message1 = (
      <>
        <p>親愛的客戶，您好：</p>
        <p>距離您上次變更密碼已屆一年。為了保障帳戶安全，請再一次變更密碼。謝謝您！</p>
      </>
    );

    const message2 = (
      <>
        <p>您確定不要變更網銀密碼嗎？</p>
        <p>久未更新網銀密碼可能會有安全性風險</p>
      </>
    );

    // 提醒久未變更密碼彈窗
    await showCustomPrompt({
      message: message1,
      cancelContent: '維持不變',
      okContent: '立即變更',
      onOk: () => {},
      // 警告不變更密碼會有安全性問題
      onCancel: async () => {
        await showCustomPrompt({
          message: message2,
          cancelContent: '取消',
          okContent: '確認',
          onOk: remainSamePwd,
        });
      },
    });
  }, []);

  return (
    <Layout title="定期網銀密碼變更" goBack={false} goHome={false}>
      <RegularPwdModifyWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <PasswordInputField
              labelName="您的網銀密碼"
              name="password"
              control={control}
              inputProps={{autoComplete: 'off'}}
            />
            <PasswordInputField
              labelName="新的網銀密碼"
              name="newPassword"
              control={control}
              inputProps={{autoComplete: 'off'}}
            />
            <PasswordInputField
              labelName="請確認新的網銀密碼"
              name="newPasswordCheck"
              control={control}
              inputProps={{autoComplete: 'off'}}
            />
          </div>
          <div>
            <InfoArea space="bottom">
              *定期進行密碼以及個資更新以確保帳號安全
            </InfoArea>
            <ConfirmButtons
              subButtonValue="維持不變"
              mainButtonValue="儲存變更"
              subButtonOnClick={remainSamePwd}
            />
          </div>
        </form>
      </RegularPwdModifyWrapper>
    </Layout>
  );
};

export default RegularPwdModify;
