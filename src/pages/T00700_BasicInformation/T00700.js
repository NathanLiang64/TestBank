/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { closeFunc, transactionAuth } from 'utilities/AppScriptProxy';
import { getCountyList, getBasicInformation, modifyBasicInformation } from 'pages/T00700_BasicInformation/api';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Elements */
import Layout from 'components/Layout/Layout';
import {FEIBInputLabel, FEIBButton } from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';

/* Styles */
import { showAnimationModal, showError } from 'utilities/MessageModal';
import { AuthCode } from 'utilities/TxnAuthCode';
import { useLocationOptions } from 'hooks/useLocationOptions';
import BasicInformationWrapper from './T00700.style';
import { validationSchema } from './validationSchema';

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

  const watchedValues = watch();
  const { countyOptions, districtOptions } = useLocationOptions(watchedValues.county); // 取得縣市/鄉鎮區列表
  const [originPersonalData, setOriginPersonalData] = useState();

  const fetchCountyList = async () => {
    dispatch(setWaittingVisible(true));
    // 取得個人資料，並匯入表單
    const { data, message } = await getBasicInformation();
    if (data) {
      setOriginPersonalData(data);
      const {
        email, mobile, addr, county, city,
      } = data;
      reset({
        email, mobile, addr, county: county.trim(), city: city.trim(),
      });
    } else {
      showError(message, closeFunc);
    }

    dispatch(setWaittingVisible(false));
  };

  // 設定結果彈窗
  const setResultDialog = (response) => {
    const result = response.code === '0000';

    showAnimationModal({
      isSuccess: result,
      successTitle: '設定成功',
      successDesc: '基本資料變更成功',
      errorTitle: '設定失敗',
      errorCode: response.code,
      errorDesc: response.message,
      onClose: result ? closeFunc : () => reset({ ...originPersonalData }),
    });
  };

  // caculateActionCode
  const getActionCode = (values) => {
    const {
      county, city, addr, email, mobile,
    } = values;
    const addressCode = county === originPersonalData.county
      && city === originPersonalData.city
      && addr === originPersonalData.addr
      ? 0
      : 1;
    const mobileCode = mobile === originPersonalData.mobile ? 0 : 2;
    const mailCode = email === originPersonalData.email ? 0 : 4;
    return addressCode + mobileCode + mailCode;
  };

  // 更新個人資料
  const modifyPersonalData = async (values) => {
    // TODO 尚未確定 modifyBasicInformation API 的回傳格式為何？
    const param = {
      ...values,
      actionCode: getActionCode(values),
    };
    dispatch(setWaittingVisible(true));
    const modifyDataResponse = await modifyBasicInformation(param);
    setResultDialog(modifyDataResponse);
    dispatch(setWaittingVisible(false));
  };

  // 點擊儲存變更按鈕
  const onSubmit = async (values) => {
    if (values.mobile !== originPersonalData.mobile) {
    // 有變更手機號碼
      const jsRs = await transactionAuth(AuthCode.T00700.MOBILE, values.mobile);
      if (jsRs.result) {
        modifyPersonalData(values);
      }
    } else {
      // 無變更手機號碼
      const jsRs = await transactionAuth(AuthCode.T00700.EMAIL);
      if (jsRs.result) {
        modifyPersonalData(values);
      }
    }
  };

  // 取得初始資料
  useEffect(() => {
    fetchCountyList();
  }, []);

  // 當 county 改變時，city 要被清空
  useEffect(() => {
    if (watchedValues.county) reset((formValues) => ({...formValues, city: ''}));
  }, [watchedValues.county]);

  return (
    <Layout title="基本資料變更">
      <BasicInformationWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <TextInputField
              type="number"
              name="mobile"
              labelName="行動電話"
              inputProps={{placeholder: '請輸入行動電話', inputMode: 'numeric'}}
              control={control}
            />
            <TextInputField
              name="email"
              type="email"
              labelName="電子信箱"
              inputProps={{placeholder: '請輸入電子信箱'}}
              control={control}
            />
            <FEIBInputLabel>通訊地址</FEIBInputLabel>
            <div className="selectContainer">
              <div>
                <DropdownField
                  name="county"
                  inputProps={{placeholder: '請選擇縣市'}}
                  control={control}
                  options={countyOptions}
                />
              </div>
              <div>
                <DropdownField
                  name="city"
                  inputProps={{placeholder: '請選擇鄉鎮市區'}}
                  control={control}
                  options={districtOptions}
                />
              </div>
            </div>
            <TextInputField
              name="addr"
              inputProps={{placeholder: '請輸入通訊地址'}}
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
