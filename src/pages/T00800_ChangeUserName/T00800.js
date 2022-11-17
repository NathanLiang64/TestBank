import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import e2ee from 'utilities/E2ee';
import { closeFunc, transactionAuth } from 'utilities/AppScriptProxy';
import { AuthCode } from 'utilities/TxnAuthCode';
import { PasswordInputField } from 'components/Fields';
import { FEIBButton } from 'components/elements';
import Layout from 'components/Layout/Layout';
import { changeUserName } from 'pages/T00800_ChangeUserName/api';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

import { showAnimationModal } from 'utilities/MessageModal';
import ChangeUserNameWrapper from './T00800.style';
import { validationSchema } from './validationSchema';

/**
 * T00800 使用者代號變更
 */
const ChangeUserName = () => {
  const dispatch = useDispatch();

  const { handleSubmit, control } = useForm({
    defaultValues: {
      userName: '',
      newUserName: '',
      newUserNameCheck: '',
    },
    resolver: yupResolver(validationSchema),
  });

  // 點擊儲存變更按鈕，表單驗證 呼叫變更使用者代號 API
  const onSubmit = async ({ userName, newUserName, newUserNameCheck }) => {
    const jsRs = await transactionAuth(AuthCode.T00800);
    if (jsRs.result) {
      const param = {
        userName: e2ee(userName),
        newUserName: e2ee(newUserName),
        newUserNameCheck: e2ee(newUserNameCheck),
      };
      dispatch(setWaittingVisible(true));
      const { code, message } = await changeUserName(param);

      showAnimationModal({
        isSuccess: code === '0000',
        successTitle: '設定成功',
        successDesc: '您已成功變更使用者代號',
        errorTitle: '設定失敗',
        errorCode: code, // TODO
        errorDesc: message,
        onClose: closeFunc,
      });

      dispatch(setWaittingVisible(false));
    }
  };

  return (
    <Layout title="使用者代號變更">
      <ChangeUserNameWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <PasswordInputField
              name="userName"
              control={control}
              labelName="您的使用者代號"
              placeholder="請輸入使用者代號(6-20位英數字)"
            />
            <PasswordInputField
              name="newUserName"
              control={control}
              labelName="新的使用者代號"
              placeholder="請輸入新的使用者代號(6-20位英數字)"
            />
            <PasswordInputField
              name="newUserNameCheck"
              control={control}
              labelName="請確認新的使用者代號"
              placeholder="請輸入新的使用者代號(6-20位英數字)"
            />
          </div>
          <FEIBButton type="submit">儲存變更</FEIBButton>
        </form>
      </ChangeUserNameWrapper>
    </Layout>
  );
};

export default ChangeUserName;
