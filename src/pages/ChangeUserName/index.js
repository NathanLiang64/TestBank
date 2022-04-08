import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetEnCrydata } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import e2ee from 'utilities/E2ee';
import { changeUserNameApi } from 'apis';
import { closeFunc, switchLoading } from 'utilities/BankeePlus';

/* Elements */
import Header from 'components/Header';
import {
  FEIBInput, FEIBInputLabel, FEIBButton, FEIBErrorMessage,
} from 'components/elements';
import { setIsOpen, setCloseCallBack, setResultContent } from 'pages/ResultDialog/stores/actions';
import { accountValidation, confirmAccountValidation } from 'utilities/validation';

/* Styles */
import ChangeUserNameWrapper from './changeUserName.style';

const ChangeUserName = () => {
  const dispatch = useDispatch();
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
      successDesc: '您已成功變更使用者代號',
      errorTitle: '設定失敗',
      errorCode,
      errorDesc,
    }));
    dispatch(setIsOpen(true));
  };

  // 呼叫變更使用者代號 API
  const handleChangeUserName = async () => {
    switchLoading(true);
    const param = {
      userName: e2ee(getValues('userName')),
      newUserName: e2ee(getValues('newUserName')),
      newUserNameCheck: e2ee(getValues('newUserNameCheck')),
    };
    const changeUserNameResponse = await changeUserNameApi.changeUserName(param);
    setResultDialog(changeUserNameResponse);
    switchLoading(false);
  };

  // 點擊儲存變更按鈕，表單驗證
  const onSubmit = () => {
    handleChangeUserName();
  };

  useGetEnCrydata();

  useEffect(() => dispatch(setIsOpen(false)), []);

  return (
    <>
      <Header title="使用者代號變更" />
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
    </>
  );
};

export default ChangeUserName;
