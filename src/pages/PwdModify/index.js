import { useDispatch } from 'react-redux';
import { useGetEnCrydata, useGetPagedata } from 'hooks';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { pwdModifyApi } from 'apis';
import { closeFunc } from 'utilities/BankeePlus';

/* Elements */
import Header from 'components/Header';
import {
  FEIBButton,
} from 'components/elements';
import { setIsOpen, setCloseCallBack, setResultContent } from 'pages/ResultDialog/stores/actions';
import PasswordInput from 'components/PasswordInput';
import e2ee from 'utilities/E2ee';
import { confirmPasswordValidation, passwordValidation } from 'utilities/validation';

/* Styles */
// import theme from 'themes/theme';
import PwdModifyWrapper from './pwdModify.style';

const PwdModify = () => {
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
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 關閉結果彈窗
  const handleCloseResultDialog = () => {
    closeFunc();
  };

  // 設定結果彈窗
  const setResultDialog = (response) => {
    const result = 'custName' in response;
    let errorCode = '';
    let errorDesc = '';
    let closeCallBack;
    if (result) {
      closeCallBack = handleCloseResultDialog;
    } else {
      // [errorCode, errorDesc] = response.message.split(' ');
      [errorCode, errorDesc] = ['test error', '變更失敗'];
      closeCallBack = () => {};
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
    dispatch(setCloseCallBack(closeCallBack));
    dispatch(setIsOpen(true));
  };

  // 呼叫變更網銀密碼 API
  const handlePasswordModify = async () => {
    const param = {
      password: e2ee(getValues('password')),
      newPassword: e2ee(getValues('newPassword')),
      newPasswordCheck: e2ee(getValues('newPasswordCheck')),
    };
    const changePwdResponse = await pwdModifyApi.changePwd(param);
    console.log('變更網銀密碼回傳', changePwdResponse);
    setResultDialog(changePwdResponse);
  };

  // 點擊儲存變更按鈕，表單驗證
  const onSubmit = async () => {
    handlePasswordModify();
  };

  useGetEnCrydata();
  useGetPagedata();

  return (
    <>
      <Header title="網銀密碼變更" />
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
    </>
  );
};

export default PwdModify;
