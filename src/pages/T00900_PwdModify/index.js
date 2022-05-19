import { useDispatch } from 'react-redux';
import { useGetEnCrydata } from 'hooks';
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

  // 設定結果彈窗
  const setResultDialog = (response) => {
    const result = 'custName' in response;
    let errorCode = '';
    let errorDesc = '';
    if (result) {
      dispatch(setCloseCallBack(() => closeFunc()));
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

  // 呼叫變更網銀密碼 API
  const handlePasswordModify = async () => {
    const param = {
      password: e2ee(getValues('password')),
      newPassword: e2ee(getValues('newPassword')),
      newPasswordCheck: e2ee(getValues('newPasswordCheck')),
    };
    const changePwdResponse = await pwdModifyApi.changePwd(param);
    setResultDialog(changePwdResponse);
  };

  // 點擊儲存變更按鈕，表單驗證
  const onSubmit = async () => {
    handlePasswordModify();
  };

  useGetEnCrydata();

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
