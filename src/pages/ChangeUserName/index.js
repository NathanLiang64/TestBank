import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
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
import { setIsOpen, setCloseCallBack, setResultContent } from 'pages/ResultDialog/stores/actions';
import { accountValidation, confirmAccountValidation } from 'utilities/validation';

/* Styles */
import ChangeUserNameWrapper from './changeUserName.style';

const ChangeUserName = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    userName: accountValidation(),
    newUserName: accountValidation(),
    newUserNameCheck: confirmAccountValidation('newUserName'),
  });
  const {
    handleSubmit, control, formState: { errors }, getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 關閉結果彈窗
  const handleCloseResultDialog = () => {
    history.go(-1);
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
      [errorCode, errorDesc] = response.message.split(' ');
      closeCallBack = () => {};
    }
    dispatch(setResultContent({
      isSuccess: result,
      successTitle: '設定成功',
      successDesc: '您已成功變更使用者代號',
      errorTitle: '設定失敗',
      errorCode,
      errorDesc,
    }));
    dispatch(setCloseCallBack(closeCallBack));
    dispatch(setIsOpen(true));
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
    setResultDialog(changeUserNameResponse);
  };

  // 點擊儲存變更按鈕，表單驗證
  const onSubmit = () => {
    handleChangeUserName();
  };

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
        </div>
        <FEIBButton
          type="submit"
        >
          儲存變更
        </FEIBButton>
      </form>
    </ChangeUserNameWrapper>
  );
};

export default ChangeUserName;
