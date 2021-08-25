import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import { basicInformationApi } from 'apis';

/* Elements */
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBSelect,
  FEIBOption,
  FEIBButton,
  FEIBErrorMessage,
} from 'components/elements';
// import PasswordInput from 'components/PasswordInput';
// import { passwordValidation } from 'utilities/validation';
/* Styles */
import BasicInformationWrapper from './basicInformation.style';

const BasicInformation = () => {
  const history = useHistory();
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
    city: yup
      .string()
      .required('請選擇縣市'),
    district: yup
      .string()
      .required('請選擇鄉鎮市區'),
    address: yup
      .string()
      .required('請輸入通訊地址'),
    // ...passwordValidation,
  });
  const {
    handleSubmit, control, formState: { errors }, reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 取得縣市列表
  const getCountyList = () => {
    // const data = [];
  };

  // 取得鄉鎮市區列表
  const getDistrict = () => {
  };

  // 取得個人資料
  const getPersonalData = () => {
    // mock data
    const data = {
      phone: '0905123456',
      email: 'example@mail.com',
      city: '台北市',
      district: '大安區',
      address: '某某路一段二號',
    };
    reset(data);
  };

  // 更新個人資料
  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    history.push('/basicInformation1');
  };

  useCheckLocation();
  usePageInfo('/api/basicInformation');

  useEffect(() => {
    getCountyList();
    getDistrict();
    getPersonalData();
  }, []);

  return (
    <BasicInformationWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
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
                    <FEIBOption value="台北市">台北市</FEIBOption>
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
                    <FEIBOption value="大安區">大安區</FEIBOption>
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
          {/* <PasswordInput
            label="網銀密碼"
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
    </BasicInformationWrapper>
  );
};

export default BasicInformation;
