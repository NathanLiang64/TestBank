import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { switchLoading, transactionAuth, closeFunc } from 'utilities/AppScriptProxy';
import { renewPwd } from 'pages/A00700_RegularPwdModify/api';

/* Elements */
import Layout from 'components/Layout/Layout';
// import { FEIBButton } from 'components/elements';
import PasswordInput from 'components/PasswordInput';
// import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';
import InfoArea from 'components/InfoArea';
import { setIsOpen, setCloseCallBack, setResultContent } from 'pages/ResultDialog/stores/actions';
import { confirmPasswordValidation, passwordValidation } from 'utilities/validation';
import e2ee from 'utilities/E2ee';

/* Styles */
// import theme from 'themes/theme';
// eslint-disable-next-line no-unused-vars
import { customPopup, showCustomPrompt } from 'utilities/MessageModal';
import RegularPwdModifyWrapper from './regularPwdModify.style';

const RegularPwdModify = () => {
  const dispatch = useDispatch();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    password: passwordValidation(),
    newPassword: passwordValidation(),
    newPasswordCheck: confirmPasswordValidation('newPassword'),
  });
  const {
    handleSubmit, control, formState: { errors }, getValues,
    // handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // const [showNotiDialog, setShowNotiDialog] = useState(true);
  // const [showWarningDialog, setShowWarningDialog] = useState(false);

  // 設定結果彈窗
  const setResultDialog = ({ code, message }) => {
    const isSuccess = code === '0000';
    if (isSuccess) {
      dispatch(setCloseCallBack(() => closeFunc()));
    } else {
      dispatch(setCloseCallBack(() => closeFunc()));
    }
    dispatch(setResultContent({
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
    }));
    dispatch(setIsOpen(true));
  };

  // 點擊儲存變更，呼叫更新網銀密碼API
  const onSubmit = async () => {
    const authCode = 0x24;
    const jsRs = await transactionAuth(authCode);
    if (jsRs.result) {
      switchLoading(true);
      const param = {
        password: e2ee(getValues('password')),
        newPassword: e2ee(getValues('newPassword')),
        newPasswordCheck: e2ee(getValues('newPasswordCheck')),
        actionCode: 1,
      };
      const changePwdResponse = await renewPwd(param);
      setResultDialog(changePwdResponse);
      switchLoading(false);
    }
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
      // 警告不變更密碼會有安全性問題
      onCancel: async () => {
        await showCustomPrompt({
          message: message2,
          cancelContent: '取消',
          okContent: '維持不變',
          onOk: async () => {
            // TODO: =====待調整=====
            const param = {
              actionCode: 2,
            };
            await renewPwd(param);
            closeFunc();
          },
        });
      },
    });
  }, []);

  // 提醒久未變更密碼彈窗
  // eslint-disable-next-line no-unused-vars
  // const renderNotiDialog = () => (
  //   <Dialog
  //     isOpen={showNotiDialog}
  //     onClose={() => setShowNotiDialog(false)}
  //     content={(
  //       <>
  //         <p>親愛的客戶，您好：</p>
  //         <p>距離您上次變更密碼已屆一年。為了保障帳戶安全，請再一次變更密碼。謝謝您！</p>
  //       </>
  //     )}
  //     action={(
  //       <ConfirmButtons
  //         subButtonValue="維持不變"
  //         mainButtonValue="立即變更"
  //         subButtonOnClick={() => {
  //           setShowNotiDialog(false);
  //           setShowWarningDialog(true);
  //         }}
  //         mainButtonOnClick={() => {
  //           setShowNotiDialog(false);
  //         }}
  //       />
  //     )}
  //   />
  // );

  // 警告不變更密碼會有安全性問題
  // const renderWarningDialog = () => (
  //   <Dialog
  //     isOpen={showWarningDialog}
  //     onClose={() => setShowWarningDialog(false)}
  //     content={(
  //       <>
  //         <p>您確定不要變更網銀密碼嗎？</p>
  //         <p>久未更新網銀密碼可能會有安全性風險</p>
  //       </>
  //     )}
  //     action={(
  //       <ConfirmButtons
  //         mainButtonOnClick={async () => {
  //           const param = {
  //             actionCode: 2,
  //           };
  //           await renewPwd(param);
  //           setShowWarningDialog(false);
  //           closeFunc();
  //         }}
  //         subButtonOnClick={() => setShowWarningDialog(false)}
  //       />
  //     )}
  //   />
  // );

  useEffect(() => dispatch(setIsOpen(false)), []);

  return (
    <Layout title="定期網銀密碼變更" goBack={false} goHome={false}>
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
              *定期進行密碼以及個資更新以確保帳號安全
            </InfoArea>
            {/* <FEIBButton type="submit">儲存變更</FEIBButton> */}
            <ConfirmButtons
              subButtonValue="維持不變"
              mainButtonValue="儲存變更"
              subButtonOnClick={async () => {
                const param = {
                  actionCode: 2,
                };
                await renewPwd(param);
                closeFunc();
              }}
              // mainButtonOnClick={() => {
              //   setShowNotiDialog(false);
              // }}
            />
          </div>
        </form>
        {/* { renderNotiDialog() }
        { renderWarningDialog() } */}
      </RegularPwdModifyWrapper>
    </Layout>
  );
};

export default RegularPwdModify;
