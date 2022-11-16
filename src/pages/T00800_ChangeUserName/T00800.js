/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import e2ee from 'utilities/E2ee';
import { changeUserName } from 'pages/T00800_ChangeUserName/api';
import { closeFunc, transactionAuth } from 'utilities/AppScriptProxy';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import PasswordInput from 'components/PasswordInput';
import Layout from 'components/Layout/Layout';
import { setIsOpen, setCloseCallBack, setResultContent } from 'pages/ResultDialog/stores/actions';
import { accountValidation, newAccountValidation, confirmAccountValidation } from 'utilities/validation';

/* Styles */
import { AuthCode } from 'utilities/TxnAuthCode';
import ChangeUserNameWrapper from './T00800.style';

const ChangeUserName = () => {
  const dispatch = useDispatch();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    userName: accountValidation(),
    newUserName: newAccountValidation('userName'),
    newUserNameCheck: confirmAccountValidation('newUserName'),
  });
  const {handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  // 設定結果彈窗
  const setResultDialog = ({ code, message }) => {
    const isSuccess = code === '0000';
    if (isSuccess) {
      dispatch(setCloseCallBack(() => closeFunc()));
    } else {
      dispatch(setCloseCallBack(() => {}));
    }
    dispatch(setResultContent({
      isSuccess,
      successTitle: '設定成功',
      successDesc: '您已成功變更使用者代號',
      errorTitle: '設定失敗',
      errorCode: code,
      errorDesc: message,
    }));
    dispatch(setIsOpen(true));
  };

  // 呼叫變更使用者代號 API
  const handleChangeUserName = async ({userName, newUserName, newUserNameCheck}) => {
    const jsRs = await transactionAuth(AuthCode.T00800);
    if (jsRs.result) {
      const param = {
        userName: e2ee(userName),
        newUserName: e2ee(newUserName),
        newUserNameCheck: e2ee(newUserNameCheck),
      };
      dispatch(setWaittingVisible(true));
      const changeUserNameResponse = await changeUserName(param);
      setResultDialog(changeUserNameResponse);
      dispatch(setWaittingVisible(false));
    }
  };

  // 點擊儲存變更按鈕，表單驗證
  const onSubmit = (values) => {
    handleChangeUserName(values);
  };

  useEffect(() => dispatch(setIsOpen(false)), []);

  return (
    <Layout title="使用者代號變更">
      <ChangeUserNameWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <PasswordInput
              label="您的使用者代號"
              placeholder="請輸入使用者代號(6-20位英數字)"
              id="userName"
              name="userName"
              control={control}
              errorMessage={errors.userName?.message}
            />
            <PasswordInput
              label="新的使用者代號"
              placeholder="請輸入新的使用者代號(6-20位英數字)"
              id="newUserName"
              name="newUserName"
              control={control}
              errorMessage={errors.newUserName?.message}
            />
            <PasswordInput
              label="請確認新的使用者代號"
              placeholder="請輸入新的使用者代號(6-20位英數字)"
              id="newUserNameCheck"
              name="newUserNameCheck"
              control={control}
              errorMessage={errors.newUserNameCheck?.message}
            />
          </div>
          <FEIBButton
            type="submit"
          >
            儲存變更
          </FEIBButton>
        </form>
      </ChangeUserNameWrapper>
    </Layout>
  );
};

export default ChangeUserName;
