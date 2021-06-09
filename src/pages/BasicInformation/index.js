import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBSelect,
  FEIBOption,
  FEIBButton,
  FEIBErrorMessage,
} from 'components/elements';
import Dialog from 'components/Dialog';
import Alert from 'components/Alert';
import PasswordInput from 'components/PasswordInput';

/* Styles */
import BasicInformationWrapper from './basicInformation.style';

const BasicInformation = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    phone: yup
      .string()
      .required('請輸入行動電話')
      .matches(/^09[0-9]{8}$/, '行動電話格式不符'),
    email: yup
      .string()
      .required('請輸入電子信箱')
      .email('電子信箱格式不符'),
    password: yup
      .string()
      .required('請輸入網銀密碼'),
    city: yup
      .string()
      .required('請選擇縣市'),
    district: yup
      .string()
      .required('請選擇鄉鎮市區'),
    address: yup
      .string()
      .required('請輸入通訊地址'),
  });
  const {
    handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showResultDialog, setShowResultDialog] = useState(false);

  const ResultDialog = () => (
    <Dialog
      isOpen={showResultDialog}
      onClose={() => setShowResultDialog(false)}
      content={(
        <>
          <Alert state="success">變更成功</Alert>
          <p>
            您已成功變更基本資料！
          </p>
        </>
      )}
      action={(
        <FEIBButton onClick={() => setShowResultDialog(false)}>
          確定
        </FEIBButton>
      )}
    />
  );

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    setShowResultDialog(true);
  };

  useCheckLocation();
  usePageInfo('/api/basicInformation');

  return (
    <BasicInformationWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FEIBInputLabel>行動電話</FEIBInputLabel>
        <Controller
          name="phone"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FEIBInput
              {...field}
              type="text"
              inputMode="tel"
              id="phone"
              name="phone"
              placeholder="請輸入行動電話"
              error={!!errors.phone}
            />
          )}
        />
        <FEIBErrorMessage>{errors.phone?.message}</FEIBErrorMessage>
        <FEIBInputLabel>電子信箱</FEIBInputLabel>
        <Controller
          name="email"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FEIBInput
              {...field}
              type="text"
              inputMode="email"
              id="email"
              name="email"
              placeholder="請輸入電子信箱"
              error={!!errors.email}
            />
          )}
        />
        <FEIBErrorMessage>{errors.email?.message}</FEIBErrorMessage>
        <FEIBInputLabel>通訊地址</FEIBInputLabel>
        <div className="selectContainer">
          <div>
            <Controller
              name="city"
              defaultValue=""
              control={control}
              placeholder="請選擇縣市"
              render={({ field }) => (
                <FEIBSelect
                  {...field}
                  id="city"
                  name="city"
                  placeholder="請選擇縣市"
                  error={!!errors.city}
                >
                  <FEIBOption value="" disabled>請選擇縣市</FEIBOption>
                  <FEIBOption value="1">台北市</FEIBOption>
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.city?.message}</FEIBErrorMessage>
          </div>
          <div>
            <Controller
              name="district"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBSelect
                  {...field}
                  id="district"
                  name="district"
                  error={!!errors.district}
                >
                  <FEIBOption value="" disabled>請選擇鄉鎮市區</FEIBOption>
                  <FEIBOption value="1">大安區</FEIBOption>
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.district?.message}</FEIBErrorMessage>
          </div>
        </div>
        <Controller
          name="address"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FEIBInput
              {...field}
              type="text"
              inputMode="address"
              id="address"
              name="address"
              placeholder="請輸入通訊地址"
              error={!!errors.address}
            />
          )}
        />
        <FEIBErrorMessage>{errors.address?.message}</FEIBErrorMessage>
        <PasswordInput
          label="網銀密碼"
          id="password"
          name="password"
          control={control}
          errorMessage={errors.password?.message}
        />
        <FEIBButton
          type="submit"
        >
          儲存變更
        </FEIBButton>
      </form>
      <ResultDialog />
    </BasicInformationWrapper>
  );
};

export default BasicInformation;
