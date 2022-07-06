/* eslint-disable no-unused-vars */
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { switchLoading, closeFunc } from 'utilities/AppScriptProxy';
import { changeCardlessPwd } from 'pages/D00400_CardLessWithDrawChgPwd/api';

/* Elements */
import Header from 'components/Header';
import {
  FEIBButton,
} from 'components/elements';
import PasswordInput from 'components/PasswordInput';
import Accordion from 'components/Accordion';
import { setIsOpen, setCloseCallBack, setResultContent } from 'pages/ResultDialog/stores/actions';
import { cardlessWithdrawPasswordValidation, confirmCardlessWithdrawPasswordValidation } from 'utilities/validation';
/* Styles */
import CardLessATMWrapper from '../D00300_CardLessATM/cardLessATM.style';

const CardLessWithDrawChgPwd = () => {
  const dispatch = useDispatch();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    oldPassword: cardlessWithdrawPasswordValidation(),
    newPassword: cardlessWithdrawPasswordValidation(),
    newPasswordConfirm: confirmCardlessWithdrawPasswordValidation('newPassword'),
  });
  const {
    handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 關閉結果彈窗
  const handleCloseResultDialog = () => {
    closeFunc();
  };

  // 設定結果彈窗
  const setResultDialog = ({ code, message }) => {
    const isSuccess = code === '0000';
    let closeCallBack;
    if (isSuccess) {
      closeCallBack = handleCloseResultDialog;
    } else {
      closeCallBack = () => {};
    }
    dispatch(setResultContent({
      isSuccess,
      successTitle: '設定成功',
      successDesc: '您的無卡提款密碼變更成功囉！',
      errorTitle: '設定失敗',
      errorCode: code,
      errorDesc: message,
    }));
    dispatch(setCloseCallBack(closeCallBack));
    dispatch(setIsOpen(true));
    switchLoading(false);
  };

  // 設定無卡提款密碼
  const changePwdHandler = async (param) => {
    switchLoading(true);
    const changePwdResponse = await changeCardlessPwd(param);
    setResultDialog(changePwdResponse);
  };

  const onSubmit = async (data) => {
    const param = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    changePwdHandler(param);
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <PasswordInput
          label="舊提款密碼"
          id="oldPassword"
          name="oldPassword"
          placeholder="請輸入舊提款密碼(4-12位數字)"
          inputMode="numeric"
          control={control}
          errorMessage={errors.oldPassword?.message}
          inputProps={{
            maxLength: 12,
          }}
        />
        <PasswordInput
          label="新提款密碼"
          id="newPassword"
          name="newPassword"
          placeholder="請輸入新提款密碼(4-12位數字)"
          inputMode="numeric"
          control={control}
          errorMessage={errors.newPassword?.message}
          inputProps={{
            maxLength: 12,
          }}
        />
        <PasswordInput
          label="確認新提款密碼"
          id="newPasswordConfirm"
          name="newPasswordConfirm"
          placeholder="請再輸入一次新提款密碼(4-12位數字)"
          inputMode="numeric"
          control={control}
          errorMessage={errors.newPasswordConfirm?.message}
          inputProps={{
            maxLength: 12,
          }}
        />
        <Accordion space="both">
          <ul>
            <li>提醒您應注意密碼之設置及使用，不宜使用與您個人資料有關或具連續性、重複性或規則性之號碼為密碼，且不得將上開交易驗證資訊以任何方式使第三人知悉獲得以知悉，以確保交易安全。</li>
          </ul>
        </Accordion>
      </div>
      <FEIBButton
        type="submit"
      >
        確認
      </FEIBButton>
    </form>
  );

  return (
    <>
      <Header title="變更無卡提款密碼" />
      <CardLessATMWrapper>
        {renderForm()}
      </CardLessATMWrapper>
    </>
  );
};

export default CardLessWithDrawChgPwd;
