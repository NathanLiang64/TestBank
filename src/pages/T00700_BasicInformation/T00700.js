/* eslint-disable object-curly-newline */
import { useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { getProfile, updateProfile, verifyMail } from 'pages/T00700_BasicInformation/api';
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
 * T00700 基本資料變更
 * @param {{location: {state: {viewModel, model}}}} props
 */
const T00700 = (props) => {
  const { location } = props;
  const { state } = location;

  const history = useHistory();
  const dispatch = useDispatch();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [viewModel, setViewModel] = useState({
    originData: null, // 變更前的原值
    countyOptions: localCounties.map(({name}) => ({label: name, value: name})), // 縣市清單
    cityOptions: [], // 鄉鎮市區清單
    selectedCounty: null,
    selectedCity: null,
  });

  const {
    handleSubmit, control, reset, setValue, watch,
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
  const { county, city } = watch();

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
      onClose: isSuccess ? () => {} : () => reset({ ...viewModel.originData }),
    });
  };

  // 點擊儲存變更按鈕
  const onSubmit = async (values) => {
    const {email} = values;
    if (email !== viewModel.originData.email) {
      const verifyRs = await verifyMail(email);

      // // DEBUG
      // verifyRs.status = 2;
      // verifyRs.relations = [{ name: 'OO男', id: '11AA' }, { name: 'XX女', id: '22BB' }];

      viewModel.emailStatus = verifyRs.status; // 驗證狀態：0=已驗證過, 1=立即驗證, 2=選擇理由, 3=無法使用, 9=驗證信已發送，但尚未驗證
      if (verifyRs.status !== 0) {
        viewModel.relationPeople = verifyRs.relations;
        history.replace('T007001', {
          viewModel, // 返回可能變更 emailStatus, 增加 emailRelations
          model: values, // 返回可能增加 emailVerifyToken
        });
        return;
      }
    }

    let authCode = Func.T007.authCode.EMAIL_ADDRESS; // 未變更手機號碼
    if (values.mobile !== viewModel.originData.mobile) {
      // eslint-disable-next-line no-bitwise
      authCode |= Func.T007.authCode.MOBILE; // 有變更手機號碼時；可使用密碼驗證(+0x10)，並且需要驗新門號(+0x01)
    }

    const authRs = await transactionAuth(authCode, values.mobile);

    if (authRs.result) {
      const countyData = findCounty(values.county);
      const {zipCode} = findCity(countyData.code, values.city);

      // 更新個人資料
      dispatch(setWaittingVisible(true));
      const rqData = {
        ...values,
        zipCode: `${zipCode}00`, // 原 zipCode是三碼，帶過去要五碼，故補齊
      };
      await updateProfile(rqData).then(async (apiRs) => {
        await setResultDialog(apiRs);
      }).finally(() => dispatch(setWaittingVisible(false)));
    }
  };

  // 取得初始資料
  useEffect(() => {
    dispatch(setWaittingVisible(true));

    // 從確認頁返回。
    if (state && state.viewModel) {
      setViewModel(state.viewModel);
      reset(state.model);
      dispatch(setWaittingVisible(false));
    } else {
      // 取得個人資料，並匯入表單
      getProfile().then((personalData) => {
        viewModel.originData = personalData;
        viewModel.selectedCounty = personalData.county;
        viewModel.selectedCity = personalData.city;
        reset({
          mobile: personalData.mobile,
          email: personalData.email,
          county: personalData.county,
          city: personalData.city,
          addr: personalData.addr,
        });
      }).finally(() => dispatch(setWaittingVisible(false)));
    }
  }, []);

  // 當 county 改變時，city 要被清空
  useEffect(() => {
    const foundCounty = findCounty(county);
    if (foundCounty) {
      viewModel.cityOptions = localCities[foundCounty.code].map((data) => ({
        label: data.name,
        value: data.name,
      }));

      if (!findCity(foundCounty.code, city)) {
        viewModel.selectedCity = null;
        setValue('city', '');
      }
      forceUpdate(); // 因為鄉鎮市區下拉清單已經換了！
    }
    // // NOTE 目前後端傳過來的 city 以及 county 很亂，
    // // 如果 foundCounty 不存在，代表後端傳過來的 county 是錯的，無法在 localCounties 找到
    // // 因此把 county 以及 city 兩個欄位清空，要求使用者再選一次
    // viewModel.selectedCity = null;
    // viewModel.cityOptions = [];
    // reset({
    //   county: '',
    //   city: '',
    // });
  }, [county]);

  useEffect(() => {
    if (city === '' && viewModel.selectedCity) { // 這個情境只有在 county 變更時才會發生。
      setValue('city', viewModel.selectedCity);
    } else {
      viewModel.selectedCity = city;
    }
  }, [city]);

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
                options={viewModel.countyOptions}
              />
              <DropdownField
                name="city"
                inputProps={{ placeholder: '請選擇鄉鎮市區' }}
                control={control}
                options={viewModel.cityOptions}
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
