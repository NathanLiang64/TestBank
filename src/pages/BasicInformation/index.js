import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { basicInformationApi, settingApi } from 'apis';

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
    mobile: yup
      .string()
      .required('請輸入行動電話')
      .matches(/^09[0-9]{8}$/, '行動電話格式不符'),
    email: yup
      .string()
      .required('請輸入電子信箱')
      .email('電子信箱格式不符'),
    county: yup
      .string()
      .required('請選擇縣市'),
    city: yup
      .string()
      .required('請選擇鄉鎮市區'),
    addr: yup
      .string()
      .required('請輸入通訊地址'),
  });
  const {
    handleSubmit, control, formState: { errors }, reset, getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 跳轉結果頁
  const toResultPage = (param) => {
    const data = 'mobilePhone' in param;
    history.push('/basicInformation1', { data });
  };

  // 取得縣市列表
  const getCountyList = async () => {
    const countyListResponse = await settingApi.getCountyList({});
    console.log('取得縣市鄉鎮區資料');
    console.log(countyListResponse);
  };

  // 取得鄉鎮市區列表
  const getCity = () => {
  };

  // 取得個人資料
  const getPersonalData = async () => {
    const basicInformationResponse = await basicInformationApi.getBasicInformation({});
    console.log('取得基本資料回傳', basicInformationResponse);
    const data = {
      ...basicInformationResponse,
    };
    reset(data);
  };

  // 更新個人資料
  const modifyPersonalData = async () => {
    const data = getValues();
    const param = {
      county: data.county,
      district: data.city,
      zipcode: data.zipCode,
      address: data.addr,
      mailAddr: data.email,
      mobilePhone: data.mobile,
    };
    console.log(param);
    const modifyDataResponse = await basicInformationApi.modifyBasicInformation(param);
    console.log('更新基本資料回傳', modifyDataResponse);
    toResultPage(modifyDataResponse);
  };

  // 點擊儲存變更按鈕
  const onSubmit = () => {
    modifyPersonalData();
  };

  useCheckLocation();
  usePageInfo('/api/basicInformation');

  useEffect(() => {
    getCountyList();
    getCity();
    getPersonalData();
  }, []);

  return (
    <BasicInformationWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <FEIBInputLabel>行動電話</FEIBInputLabel>
          <Controller
            name="mobile"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <FEIBInput
                {...field}
                type="text"
                inputMode="tel"
                id="mobile"
                name="mobile"
                placeholder="請輸入行動電話"
                error={!!errors.mobile}
              />
            )}
          />
          <FEIBErrorMessage>{errors.mobile?.message}</FEIBErrorMessage>
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
                name="county"
                defaultValue=""
                control={control}
                placeholder="請選擇縣市"
                render={({ field }) => (
                  <FEIBSelect
                    {...field}
                    id="county"
                    name="county"
                    placeholder="請選擇縣市"
                    error={!!errors.county}
                  >
                    <FEIBOption value="" disabled>請選擇縣市</FEIBOption>
                    <FEIBOption value="台北市">台北市</FEIBOption>
                  </FEIBSelect>
                )}
              />
              <FEIBErrorMessage>{errors.county?.message}</FEIBErrorMessage>
            </div>
            <div>
              <Controller
                name="city"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <FEIBSelect
                    {...field}
                    id="city"
                    name="city"
                    error={!!errors.city}
                  >
                    <FEIBOption value="" disabled>請選擇鄉鎮市區</FEIBOption>
                    <FEIBOption value="中正區">中正區</FEIBOption>
                  </FEIBSelect>
                )}
              />
              <FEIBErrorMessage>{errors.city?.message}</FEIBErrorMessage>
            </div>
          </div>
          <Controller
            name="addr"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <FEIBInput
                {...field}
                type="text"
                inputMode="addr"
                id="addr"
                name="addr"
                placeholder="請輸入通訊地址"
                error={!!errors.addr}
              />
            )}
          />
          <FEIBErrorMessage>{errors.addr?.message}</FEIBErrorMessage>
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
