import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGetEnCrydata } from 'hooks';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { goAppHome } from 'utilities/BankeePlus';
import { pwdModifyApi } from 'apis';

/* Elements */
import { FEIBButton } from 'components/elements';
import Header from 'components/Header';
import PasswordInput from 'components/PasswordInput';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';
import InfoArea from 'components/InfoArea';
import { setIsOpen, setCloseCallBack, setResultContent } from 'pages/ResultDialog/stores/actions';
import { confirmPasswordValidation, passwordValidation } from 'utilities/validation';
import e2ee from 'utilities/E2ee';

/* Styles */
// import theme from 'themes/theme';
import RegularPwdModifyWrapper from './regularPwdModify.style';

const RegularPwdModify = () => {
  const dispatch = useDispatch();
  dispatch(setIsOpen(false));
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
  const [showNotiDialog, setShowNotiDialog] = useState(true);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  // 設定結果彈窗
  const setResultDialog = (response) => {
    const result = 'custName' in response;
    let errorCode = '';
    let errorDesc = '';
    if (result) {
      dispatch(setCloseCallBack(() => goAppHome()));
    } else {
      errorCode = response.code;
      errorDesc = response.message;
      dispatch(setCloseCallBack(() => {}));
    }
    dispatch(setResultContent({
      isSuccess: result,
      successTitle: '設定成功',
      successDesc: (
        <>
          <p>您的網銀密碼已變更成功囉！</p>
          <p>下次請使用新設定之密碼進行登入</p>
        </>
      ),
      errorTitle: '設定失敗',
      errorCode,
      errorDesc,
    }));
    dispatch(setIsOpen(true));
  };

  // 點擊儲存變更，呼叫變更網銀密碼API
  const onSubmit = async () => {
    const param = {
      password: await e2ee(getValues('password')),
      newPassword: await e2ee(getValues('newPassword')),
      newPasswordCheck: await e2ee(getValues('newPasswordCheck')),
    };
    const changePwdResponse = await pwdModifyApi.changePwd(param);
    setResultDialog(changePwdResponse);
    // // 假設變更成功
    // const data = { custName: '' };
    // setResultDialog(data);
  };

  // const alertAesKey = () => {
  //   alert(localStorage.getItem('aesKey'));
  // };

  // const alertIvKey = () => {
  //   alert(localStorage.getItem('iv'));
  // };

  // 提醒久未變更密碼彈窗
  const renderNotiDialog = () => (
    <Dialog
      isOpen={showNotiDialog}
      onClose={() => setShowNotiDialog(false)}
      content={(
        <>
          <p>親愛的客戶，您好：</p>
          <p>距離您上次變更密碼已屆一年。為了保障帳戶安全，請再一次變更密碼。謝謝您！</p>
        </>
      )}
      action={(
        <ConfirmButtons
          subButtonValue="維持不變"
          mainButtonValue="立即變更"
          subButtonOnClick={() => {
            setShowNotiDialog(false);
            setShowWarningDialog(true);
          }}
          mainButtonOnClick={() => {
            setShowNotiDialog(false);
          }}
        />
      )}
    />
  );

  // 警告不變更密碼會有安全性問題
  const renderWarningDialog = () => (
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
          mainButtonOnClick={() => {
            setShowWarningDialog(false);
            goAppHome();
          }}
          subButtonOnClick={() => setShowWarningDialog(false)}
        />
      )}
    />
  );

  useGetEnCrydata();

  return (
    <>
      <Header title="定期網銀密碼變更" hideBack hideHome />
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
          {/* <FEIBButton type="button" onClick={alertAesKey}>aesKey</FEIBButton>
          <FEIBButton type="button" onClick={alertIvKey}>ivKey</FEIBButton> */}
          <div>
            <InfoArea space="bottom">
              *定期進行密碼以及個資更新以確保帳號安全
            </InfoArea>
            <FEIBButton type="submit">儲存變更</FEIBButton>
          </div>
        </form>
        { renderNotiDialog() }
        { renderWarningDialog() }
      </RegularPwdModifyWrapper>
    </>
  );
};

export default RegularPwdModify;
