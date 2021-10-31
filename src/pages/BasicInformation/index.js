import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
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
import { setIsOpen, setCloseCallBack, setResultContent } from 'pages/ResultDialog/stores/actions';

/* Styles */
import BasicInformationWrapper from './basicInformation.style';

const BasicInformation = () => {
  const dispatch = useDispatch();
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
    handleSubmit, control, formState: { errors }, reset, getValues, setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // eslint-disable-next-line no-unused-vars
  const [addressOptionsData, setAddressOptionsData] = useState([]);
  const [countyOptions, setCountyOptions] = useState([
    {
      countyName: '',
      countyCode: '',
    },
  ]);
  const [cityOptions, setCityOptions] = useState([
    {
      cityName: '',
      cityCode: '',
    },
  ]);

  // 取得縣市列表
  const getCountyList = async (address) => {
    const countyListResponse = await settingApi.getCountyList({});
    setAddressOptionsData(countyListResponse);
    const countyList = countyListResponse.map((item) => {
      const data = {
        countyName: item.countyName,
        countyCode: item.countyCode,
      };
      return data;
    });
    setCountyOptions(countyList);
    const { cities } = countyListResponse.find((item) => item.countyName === address.county);
    setCityOptions(cities);
  };

  // 取得個人資料
  const getPersonalData = async () => {
    const basicInformationResponse = await basicInformationApi.getBasicInformation({});
    console.log('取得基本資料回傳', basicInformationResponse);
    const data = {
      ...basicInformationResponse,
    };
    reset(data);
    console.log(data);
    const { county, city } = data;
    getCountyList({
      county,
      city,
    });
  };

  // 關閉結果彈窗
  const handleCloseResultDialog = () => {
    history.go(-1);
  };

  // 設定結果彈窗
  const setResultDialog = (response) => {
    const result = 'mobilePhone' in response;
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
      successDesc: '基本資料變更成功',
      errorTitle: '設定失敗',
      errorCode,
      errorDesc,
    }));
    dispatch(setCloseCallBack(closeCallBack));
    dispatch(setIsOpen(true));
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
    setResultDialog(modifyDataResponse);
  };

  // 點擊儲存變更按鈕
  const onSubmit = () => {
    modifyPersonalData();
  };

  // 彈性變更鄉鎮市區選單
  const filterCityOptions = (county) => {
    const { cities } = addressOptionsData.find((item) => item.countyName === county);
    setCityOptions(cities);
  };

  // 縣市選單變更
  const handleCountyChange = (e) => {
    setValue('county', e.target.value);
    filterCityOptions(e.target.value);
  };

  // 鄉鎮市區選單變更
  const handleCityChange = (e) => {
    setValue('city', e.target.value);
    const { cityCode } = cityOptions.find((item) => item.cityName === e.target.value);
    setValue('zipCode', cityCode);
  };

  // 建立縣市選單
  const renderCountyOptions = () => countyOptions.map((item) => (<FEIBOption value={item.countyName} key={item.countyCode}>{item.countyName}</FEIBOption>));

  // 建立鄉鎮市區選單
  const renderCityOptions = () => cityOptions.map((item) => (<FEIBOption value={item.cityName} key={item.cityCode}>{item.cityName}</FEIBOption>));

  useCheckLocation();
  usePageInfo('/api/basicInformation');

  useEffect(() => {
    // getCountyList();
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
                    onChange={handleCountyChange}
                  >
                    <FEIBOption value="" disabled>請選擇縣市</FEIBOption>
                    { renderCountyOptions() }
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
                    onChange={handleCityChange}
                  >
                    <FEIBOption value="" disabled>請選擇鄉鎮市區</FEIBOption>
                    { renderCityOptions() }
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
