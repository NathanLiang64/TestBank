/* eslint-disable object-curly-newline */
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { getProfile, updateProfile } from 'pages/T00700_BasicInformation/api';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { Func } from 'utilities/FuncID';

/* Elements */
import Layout from 'components/Layout/Layout';
import {FEIBInputLabel, FEIBButton } from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';

/* Styles */
import { showAnimationModal } from 'utilities/MessageModal';
import { localCounties, localCities, findCounty, findCity } from 'utilities/locationOptions';
import BasicInformationWrapper from './T00700.style';
import { validationSchema } from './validationSchema';

/**
 * 基本資料變更
 */
const T00700 = () => {
  const dispatch = useDispatch();
  const {
    handleSubmit, control, reset, watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      mobile: '',
      email: '',
      county: '',
      city: '',
      addr: '',
    },
  });

  const [watchedCounty, watchedCity] = watch(['county', 'city']);

  const [originPersonalData, setOriginPersonalData] = useState();
  const countyOptions = localCounties.map(({name}) => ({label: name, value: name}));
  const cityOptions = useMemo(() => {
    if (!watchedCounty) return [];
    const foundCounty = findCounty(watchedCounty);
    if (foundCounty) {
      return localCities[foundCounty.code].map(({ name }) => ({
        label: name,
        value: name,
      }));
    }
    // NOTE 目前後端傳過來的 city 以及 county 很亂，
    // 如果 foundCounty 不存在，代表後端傳過來的 county 是錯的，無法在 localCounties 找到
    // 因此把 county 以及 city 兩個欄位清空，要求使用者再選一次
    reset((formValues) => ({...formValues, county: '', city: ''}));
    return [];
  }, [watchedCounty]);

  const fetchCountyList = async () => {
    // 取得個人資料，並匯入表單
    const basicInfo = await getProfile();

    setOriginPersonalData(basicInfo);
    const {
      email, mobile, addr, county, city,
    } = basicInfo;

    reset({
      email, mobile, addr, county, city,
    });
  };

  // 設定結果彈窗
  const setResultDialog = async (response) => {
    const { isSuccess, code, message } = response;

    await showAnimationModal({
      isSuccess,
      successTitle: '設定成功',
      successDesc: '基本資料變更成功',
      errorTitle: '設定失敗',
      errorCode: code,
      errorDesc: message,
      onClose: isSuccess ? () => {} : () => reset({ ...originPersonalData }),
    });
  };

  // 更新個人資料
  const modifyPersonalData = async (values) => {
    dispatch(setWaittingVisible(true));
    const modifyDataResponse = await updateProfile(values);
    dispatch(setWaittingVisible(false));
    setResultDialog(modifyDataResponse);
  };

  // 點擊儲存變更按鈕
  const onSubmit = async (values) => {
    let authCode = Func.T007.authCode.EMAIL; // 預設：無變更手機號碼
    if (values.mobile !== originPersonalData.mobile) {
      // eslint-disable-next-line no-bitwise
      authCode |= Func.T007.authCode.MOBILE; // 有變更手機號碼時；可使用密碼驗證(+0x10)，並且需要驗新門號(+0x01)
    }

    dispatch(setWaittingVisible(true));
    const jsRs = await transactionAuth(authCode, values.mobile);
    dispatch(setWaittingVisible(false));
    if (jsRs.result) {
      const county = findCounty(values.county);
      const {zipCode} = findCity(county.code, values.city);

      const rqData = {
        ...values,
        zipCode: `${zipCode}00`, // 原 zipCode是三碼，帶過去要五碼，故補齊
      };
      modifyPersonalData(rqData);
    }
  };

  // 取得初始資料
  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    await fetchCountyList();
    dispatch(setWaittingVisible(false));
  }, []);

  // 當 county 改變時，city 要被清空
  useEffect(() => {
    // 如果 county 被更換後，原 city 值不存在於 districtOptions 內部，就 reset city
    const isExisted = cityOptions.find(({value}) => value === watchedCity);
    if (watchedCity && !isExisted) reset((formValues) => ({ ...formValues, city: '' }));
  }, [watchedCounty]);

  return (
    <Layout fid={Func.T007} title="基本資料變更">
      <BasicInformationWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>

          <TextInputField
            name="mobile"
            labelName="行動電話"
            inputProps={{
              placeholder: '請輸入行動電話',
              inputMode: 'numeric',
            }}
            control={control}
          />
          <TextInputField
            name="email"
            type="email"
            labelName="電子信箱"
            inputProps={{ placeholder: '請輸入電子信箱' }}
            control={control}
          />
          <div>
            <FEIBInputLabel>通訊地址</FEIBInputLabel>
            <div className="selectContainer">
              <DropdownField
                name="county"
                inputProps={{ placeholder: '請選擇縣市' }}
                control={control}
                options={countyOptions}
              />
              <DropdownField
                name="city"
                inputProps={{ placeholder: '請選擇鄉鎮市區' }}
                control={control}
                options={cityOptions}
              />
            </div>
          </div>
          <TextInputField
            name="addr"
            inputProps={{ placeholder: '請輸入通訊地址' }}
            control={control}
          />

          <FEIBButton type="submit">儲存變更</FEIBButton>
        </form>
      </BasicInformationWrapper>
    </Layout>
  );
};

export default T00700;
