import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import e2ee from 'utilities/E2ee';
import { changeUserNameApi } from 'apis';

/* Elements */
import {
  FEIBInput, FEIBInputLabel, FEIBButton, FEIBErrorMessage,
} from 'components/elements';
// import PasswordInput from 'components/PasswordInput';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';
// import { passwordValidation } from 'utilities/validation';

/* Styles */
// import theme from 'themes/theme';
import ChangeUserNameWrapper from './changeUserName.style';

const ChangeUserName = () => {
  const history = useHistory();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    userName: yup
      .string()
      .required('請輸入您的使用者代號')
      .min(6, '您輸入的使用者代號長度有誤，請重新輸入。')
      .max(20, '您輸入的使用者代號長度有誤，請重新輸入。'),
    newUserName: yup
      .string()
      .required('請輸入新的使用者代號')
      .min(6, '您輸入的新使用者代號長度有誤，請重新輸入。')
      .max(20, '您輸入的新使用者代號長度有誤，請重新輸入。'),
    newUserNameCheck: yup
      .string()
      .required('請再輸入一次新的使用者代號')
      .min(6, '您輸入的新使用者代號長度有誤，請重新輸入。')
      .max(20, '您輸入的新使用者代號長度有誤，請重新輸入。')
      .oneOf([yup.ref('newUserName'), null], '必須與新使用者代號相同'),
    // ...passwordValidation,
  });
  const {
    handleSubmit, control, formState: { errors }, getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 跳轉結果頁
  const toResultPage = (data) => {
    history.push('/changeUserName1', { data });
  };

  // 呼叫變更使用者代號 API
  const handleChangeUserName = async () => {
    const param = {
      userName: e2ee(getValues('userName')),
      newUserName: e2ee(getValues('newUserName')),
      newUserNameCheck: e2ee(getValues('newUserNameCheck')),
    };
    const changeUserNameResponse = await changeUserNameApi.changeUserName(param);
    console.log('變更使用者代號回傳', changeUserNameResponse);
    const data = 'custName' in changeUserNameResponse;
    toResultPage(data);
    setShowConfirmDialog(false);
  };

  // 點擊儲存變更按鈕，表單驗證
  const onSubmit = () => {
    setShowConfirmDialog(true);
  };

  // 確認變更使用代號彈窗
  const ConfirmDialog = () => (
    <Dialog
      isOpen={showConfirmDialog}
      onClose={() => setShowConfirmDialog(false)}
      content={<p className="txtCenter">您確定要變更使用者代號嗎？</p>}
      action={(
        <ConfirmButtons
          mainButtonOnClick={handleChangeUserName}
          subButtonOnClick={() => setShowConfirmDialog(false)}
        />
      )}
    />
  );

  useCheckLocation();
  usePageInfo('/api/changeUserName');

  return (
    <ChangeUserNameWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <FEIBInputLabel htmlFor="userName">您的使用者代號</FEIBInputLabel>
          <Controller
            name="userName"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <FEIBInput
                {...field}
                type="text"
                id="userName"
                name="userName"
                placeholder="請輸入6~20位英數字，英文字區分大小寫"
                error={!!errors.userName}
              />
            )}
          />
          <FEIBErrorMessage>{errors.userName?.message}</FEIBErrorMessage>
          <FEIBInputLabel>新的使用者代號</FEIBInputLabel>
          <Controller
            name="newUserName"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <FEIBInput
                {...field}
                type="text"
                id="newUserName"
                name="newUserName"
                placeholder="請輸入6~20位英數字，英文字區分大小寫"
                error={!!errors.newUserName}
              />
            )}
          />
          <FEIBErrorMessage>{errors.newUserName?.message}</FEIBErrorMessage>
          <FEIBInputLabel>請確認新的使用者代號</FEIBInputLabel>
          <Controller
            name="newUserNameCheck"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <FEIBInput
                {...field}
                type="text"
                id="newUserNameCheck"
                name="newUserNameCheck"
                placeholder="請再輸入一次新的使用者代號"
                error={!!errors.newUserNameCheck}
              />
            )}
          />
          <FEIBErrorMessage>{errors.newUserNameCheck?.message}</FEIBErrorMessage>
          {/* <PasswordInput
            label="請輸入網銀密碼"
            id="password"
            name="password"
            control={control}
            errorMessage={errors.password?.message}
          /> */}
        </div>
        <FEIBButton
          type="submit"
        >
          儲存變更
        </FEIBButton>
      </form>
      <ConfirmDialog />
    </ChangeUserNameWrapper>
  );
};

export default ChangeUserName;
