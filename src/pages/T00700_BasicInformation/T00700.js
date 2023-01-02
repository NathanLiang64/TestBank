/* eslint-disable object-curly-newline */
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { getBasicInformation, modifyBasicInformation } from 'pages/T00700_BasicInformation/api';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Elements */
import Layout from 'components/Layout/Layout';
import {FEIBInputLabel, FEIBButton } from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';

/* Styles */
import { showAnimationModal } from 'utilities/MessageModal';
import { AuthCode } from 'utilities/TxnAuthCode';
import { useNavigation } from 'hooks/useNavigation';
import { localCounties, localCities, findCounty, findCity } from 'utilities/locationOptions';
import BasicInformationWrapper from './T00700.style';
import { validationSchema } from './validationSchema';

/**
 * 基本資料變更
 */
const T00700 = () => {
  const dispatch = useDispatch();
  const { closeFunc } = useNavigation();
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
  const countyOptions = localCounties.map(({name, code}) => ({label: name, value: code}));
  const cityOptions = useMemo(() => {
    if (!watchedCounty) return [];
    return localCities[watchedCounty].map(({name, code}) => ({ label: name, value: code}));
  }, [watchedCounty]);

  const fetchCountyList = async () => {
    // 取得個人資料，並匯入表單
    const data = await getBasicInformation();
    if (data) {
      setOriginPersonalData(data);
      const {
        email, mobile, addr, county, city,
      } = data;
      // NOTE 目前收到的 county & city 是縣市名稱，因爲編輯資料 API 所需的 Param 為代號
      // 因此在這邊做轉換再放入表單中，接收與發送的格式是否統一待討論...
      const countyInfo = findCounty(county);
      const cityInfo = findCity(countyInfo?.code, city);
      reset({
        email, mobile, addr, county: countyInfo?.code, city: cityInfo?.code,
      });
    }
  };

  // 更新個人資料
  const modifyPersonalData = async (values) => {
    const response = await modifyBasicInformation(values);
    const isSuccess = !response.errCode;

    await showAnimationModal({
      isSuccess,
      successTitle: '設定成功',
      successDesc: '基本資料變更成功',
      errorTitle: '設定失敗',
      errorCode: response.errCode,
      errorDesc: response.message,
      onClose: isSuccess ? closeFunc : () => reset({ ...originPersonalData }), // BUG 成功後，不應該自動關閉
    });
  };

  // 點擊儲存變更按鈕
  const onSubmit = async (values) => {
    let autoCode = AuthCode.T00700.EMAIL; // 預設：無變更手機號碼
    if (values.mobile !== originPersonalData.mobile) {
      // eslint-disable-next-line no-bitwise
      autoCode |= AuthCode.T00700.MOBILE; // 有變更手機號碼時；可使用密碼驗證(+0x10)，並且需要驗新門號(+0x01)
    }

    dispatch(setWaittingVisible(true));
    const jsRs = await transactionAuth(autoCode, values.mobile);
    if (jsRs.result) {
      const county = findCounty(values.county);
      const city = findCity(county.code, values.city);
      const rqData = {
        ...values,
        county: county.name,
        city: city.name,
      };
      modifyPersonalData(rqData);
    }
    dispatch(setWaittingVisible(false));
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
    <Layout title="基本資料變更">
      <BasicInformationWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
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
            <FEIBInputLabel>通訊地址</FEIBInputLabel>
            <div className="selectContainer">
              <div>
                <DropdownField
                  name="county"
                  inputProps={{ placeholder: '請選擇縣市' }}
                  control={control}
                  options={countyOptions}
                />
              </div>
              <div>
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
          </div>
          <FEIBButton type="submit">儲存變更</FEIBButton>
        </form>
      </BasicInformationWrapper>
    </Layout>
  );
};

export default T00700;
