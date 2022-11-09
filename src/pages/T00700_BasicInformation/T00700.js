/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { closeFunc, transactionAuth } from 'utilities/AppScriptProxy';
import { getCountyList, getBasicInformation, modifyBasicInformation } from 'pages/T00700_BasicInformation/api';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Elements */
import Layout from 'components/Layout/Layout';
import {FEIBInputLabel, FEIBButton } from 'components/elements';
// import { setIsOpen, setCloseCallBack, setResultContent } from 'pages/ResultDialog/stores/actions';

/* Styles */
import { DropdownField, TextInputField } from 'components/Fields';
import { showAnimationModal } from 'utilities/MessageModal';
import BasicInformationWrapper from './T00700.style';

const T00700 = () => {
  const dispatch = useDispatch();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    mobile: yup
      .string()
      .required('請輸入行動電話')
      .matches(/^09[0-9]{8}$/, '行動電話格式不符'),
    email: yup.string().required('請輸入電子信箱').email('電子信箱格式不符'),
    county: yup.string().required('請選擇縣市'),
    city: yup.string().required('請選擇鄉鎮市區'),
    addr: yup.string().required('請輸入通訊地址'),
  });
  const {
    handleSubmit, control, reset, watch, getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      mobile: '',
      email: '',
      county: '',
      city: '',
      addr: '',
    },
  });

  const watchedCountyName = watch('county');

  const [addressOptionsData, setAddressOptionsData] = useState([]);
  const [countyOptions, setCountyOptions] = useState([]);

  const [originPersonalData, setOriginPersonalData] = useState('');

  // 取得個人資料
  const getPersonalData = async (options) => {
    const { code, data, message } = await getBasicInformation();
    if (code === '0000') {
      setOriginPersonalData(data);
      const foundCounty = options.find(
        ({ countyName }) => countyName === data.county.trim(),
      );
      const foundCity = foundCounty?.cities.find(
        ({ cityName }) => cityName === data.city.trim(),
      );
      console.log('foundCity', foundCity);
      reset({
        ...data,
        county: foundCounty.countyName,
        city: foundCity.cityName,
      });
    } else {
      console.log(code, message);
    }
    dispatch(setWaittingVisible(false));
  };

  // 取得縣市列表
  const fetchCountyList = async () => {
    dispatch(setWaittingVisible(true));
    // 拿取縣市 & 鄉鎮區列表
    const { code, data, message } = await getCountyList({});
    setAddressOptionsData(data);
    if (code === '0000') {
      setCountyOptions(data);
      getPersonalData(data);
    } else {
      console.log(code, message);
      dispatch(setWaittingVisible(false));
    }
  };

  // 設定結果彈窗
  const setResultDialog = (response) => {
    // 設定成功時，reponse 應該包含 addr city county email  mobile zipCode
    const result = 'addr' in response
      && 'city' in response
      && 'county' in response
      && 'email' in response
      && 'mobile' in response
      && 'zipCode' in response;
    let errorCode = '';
    let errorDesc = '';
    if (!result) {
      errorCode = response.code;
      errorDesc = response.message;
    }

    showAnimationModal({
      isSuccess: result,
      successTitle: '設定成功',
      successDesc: '基本資料變更成功',
      errorTitle: '設定失敗',
      errorCode,
      errorDesc,
      onClose: result ? closeFunc : () => reset({...originPersonalData}),
    });
  };

  // caculateActionCode
  const getActionCode = (values) => {
    const {
      county, city, zipCode, addr, email, mobile,
    } = values;
    const addressCode = county === originPersonalData.county
      && city === originPersonalData.city
      && zipCode === originPersonalData.zipCode
      && addr === originPersonalData.addr
      ? 0
      : 1;
    const mobileCode = mobile === originPersonalData.mobile ? 0 : 2;
    const mailCode = email === originPersonalData.email ? 0 : 4;
    return addressCode + mobileCode + mailCode;
  };

  // 更新個人資料
  const modifyPersonalData = async (values) => {
    const {
      county, city, zipCode, addr, email, mobile,
    } = values;
    const param = {
      county,
      city,
      // 變動後的zipCode無法得知 ，不應該提供才對
      zipCode,
      addr,
      email,
      mobile,
      actionCode: getActionCode(values),
    };
    dispatch(setWaittingVisible(true));
    const modifyDataResponse = await modifyBasicInformation(param);
    console.log(modifyDataResponse);
    setResultDialog(modifyDataResponse);
    dispatch(setWaittingVisible(false));
  };

  // 點擊儲存變更按鈕
  const onSubmit = async (values) => {
    if (values.mobile !== originPersonalData.mobile) {
    // 有變更手機號碼
      const authCode = 0x36;
      const jsRs = await transactionAuth(authCode, values.mobile);
      if (jsRs.result) {
        modifyPersonalData(values);
      }
    } else {
      // 無變更手機號碼
      const authCode = 0x26;
      const jsRs = await transactionAuth(authCode);
      if (jsRs.result) {
        modifyPersonalData(values);
      }
    }
  };

  // 建立縣市選單
  const generateCountyOptions = () => {
    if (countyOptions.length) {
      return countyOptions.map(({ countyName }) => ({
        label: countyName,
        value: countyName,
      }));
    }
    return [];
  };
  // 建立鄉鎮市區選單
  const generateDistrictOptions = () => {
    const foundDistrictOption = countyOptions.find(({ countyName }) => countyName === watchedCountyName);
    if (foundDistrictOption) {
      return foundDistrictOption.cities.map(({ cityName }) => ({
        label: cityName,
        value: cityName,
      }));
    }
    return [];
  };

  useEffect(() => {
    fetchCountyList();
  }, []);

  useEffect(() => {
    if (watchedCountyName !== originPersonalData.county) {
      reset({...getValues(), city: ''});
    }
  }, [watchedCountyName]);

  return (
    <Layout title="基本資料變更">
      <BasicInformationWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <TextInputField
              name="mobile"
              labelName="行動電話"
              placeholder="請輸入行動電話"
              control={control}
            />
            <TextInputField
              name="email"
              labelName="電子信箱"
              placeholder="請輸入電子信箱"
              control={control}
            />
            <FEIBInputLabel>通訊地址</FEIBInputLabel>
            <div className="selectContainer">
              <div>
                <DropdownField
                  name="county"
                  placeholder="請選擇縣市"
                  control={control}
                  options={generateCountyOptions()}
                />
              </div>
              <div>
                <DropdownField
                  name="city"
                  placeholder="請選擇縣市"
                  control={control}
                  options={generateDistrictOptions()}
                />
              </div>
            </div>
            <TextInputField
              name="addr"
              placeholder="請輸入通訊地址"
              control={control}
            />
          </div>
          <FEIBButton type="submit">儲存變更</FEIBButton>
        </form>
      </BasicInformationWrapper>
    </Layout>
  );
};

export default T00700;
