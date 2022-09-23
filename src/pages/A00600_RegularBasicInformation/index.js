/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { fetchJobsCode, updateRegularBasicInformation } from 'pages/A00600_RegularBasicInformation/api';
import { closeFunc } from 'utilities/AppScriptProxy';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Elements */
import {
  FEIBInputLabel,
  FEIBSelect,
  FEIBOption,
  FEIBErrorMessage,
  FEIBButton,
} from 'components/elements';
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import { setIsOpen, setCloseCallBack, setResultContent } from 'pages/ResultDialog/stores/actions';

/* Styles */
import theme from 'themes/theme';
import RegularBasicInformationWrapper from './regularBasicInformation.style';

const RegularBasicInformation = () => {
  const dispatch = useDispatch();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    industry: yup
      .string()
      .required('尚未選擇行業類別'),
    title: yup
      .string()
      .required('尚未選擇職稱'),
    income: yup
      .string()
      .required('尚未選擇個人年收入'),
  });
  const {
    handleSubmit, control, formState: { errors }, getValues, reset, setValue,
    // handleSubmit, control, formState: { errors }, reset, setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [regularBasicData, setRegularBasicData] = useState({
    grade: '',
    income: '',
    jobcd: '',
  });
  const [gradeOptions, setGradeOptions] = useState([{ code: '', name: '' }]);
  const [incomeOptions, setIncomeOptions] = useState([{ code: '', name: '' }]);
  const [jobOptions, setJobOptions] = useState([{ code: '', name: '' }]);

  // 點擊重新設定
  const resetForm = () => {
    reset({
      industry: regularBasicData.jobcd,
      title: regularBasicData.grade,
      income: regularBasicData.income,
    });
  };

  // 取得職業別清單
  const getJobsCode = async () => {
    dispatch(setWaittingVisible(true));
    const { code, message, data } = await fetchJobsCode({});
    if (code === '0000') {
      const {
        gradeList, incomeList, jobList,
      } = data;

      console.log(data);

      setGradeOptions(gradeList);
      setIncomeOptions(incomeList);
      setJobOptions(jobList);

      const grade = gradeList.find((item) => item.code === data.grade)?.code || '';
      const income = incomeList.find((item) => item.code === data.income)?.code || '';
      const jobcd = jobList.find((item) => item.code === data.jobcd)?.code || '';

      setRegularBasicData({
        grade,
        income,
        jobcd,
      });

      setValue('industry', jobcd);
      setValue('title', grade);
      setValue('income', income);
    } else {
      dispatch(setCloseCallBack(() => closeFunc()));
      dispatch(setResultContent({
        isSuccess: false,
        successTitle: '',
        successDesc: '',
        errorTitle: '發生錯誤',
        errorCode: code,
        errorDesc: message,
      }));
      dispatch(setIsOpen(true));
    }
    dispatch(setWaittingVisible(false));
  };

  // 設定結果彈窗
  const setResultDialog = ({ code, message }) => {
    if (code === '0000') {
      dispatch(setCloseCallBack(() => closeFunc()));
    } else {
      dispatch(setCloseCallBack(() => {}));
    }
    dispatch(setResultContent({
      isSuccess: code === '0000',
      successTitle: '設定成功',
      successDesc: '基本資料變更成功',
      errorTitle: '設定失敗',
      errorCode: code,
      errorDesc: message,
    }));
    dispatch(setIsOpen(true));
  };

  // caculate action code
  const getActionCode = (modifyData) => {
    const jobCdCode = modifyData.jobCd === regularBasicData.jobcd ? 0 : 2;
    const gradeCode = modifyData.grade === regularBasicData.grade ? 0 : 1;
    const incomeCode = modifyData.inCome === regularBasicData.income ? 0 : 4;
    return jobCdCode + gradeCode + incomeCode;
  };

  // 更新基本資料
  const modifyPersonalData = async () => {
    dispatch(setWaittingVisible(true));
    const data = getValues();
    const modifyData = {
      jobCd: data.industry,
      grade: data.title,
      inCome: data.income,
    };
    const param = {
      ...modifyData,
      actionCode: getActionCode(modifyData),
    };

    const modifyResponse = await updateRegularBasicInformation(param);
    setResultDialog(modifyResponse);
    dispatch(setWaittingVisible(false));
  };

  // 點擊確認按鈕
  const onSubmit = () => {
    modifyPersonalData();
  };

  // 建立選單
  const renderOptionsList = (data) => data.map((item) => (
    <FEIBOption key={item.code} value={item.code}>{item.name}</FEIBOption>
  ));

  useEffect(() => {
    dispatch(setIsOpen(false));
    getJobsCode();
  }, []);

  return (
    <Layout title="六個月基本資料變更" goBack={false} goHome={false}>
      <RegularBasicInformationWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="description">
              親愛的客戶您好：
              <br />
              為維護您留存於本行之基本資料完整性，麻煩您撥冗協助「客戶基本資料更新」作業，感謝您的配合。
            </div>
            <div>
              <FEIBInputLabel>行業類別</FEIBInputLabel>
              <Controller
                name="industry"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <FEIBSelect
                    {...field}
                    id="industry"
                    name="industry"
                    error={!!errors.industry}
                  >
                    <FEIBOption value="" disabled>請選擇行業類別</FEIBOption>
                    { renderOptionsList(jobOptions) }
                  </FEIBSelect>
                )}
              />
              <FEIBErrorMessage>{errors.industry?.message}</FEIBErrorMessage>
              <FEIBInputLabel>職稱</FEIBInputLabel>
              <Controller
                name="title"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <FEIBSelect
                    {...field}
                    id="title"
                    name="title"
                    error={!!errors.title}
                  >
                    <FEIBOption value="" disabled>請選擇職稱</FEIBOption>
                    { renderOptionsList(gradeOptions) }
                  </FEIBSelect>
                )}
              />
              <FEIBErrorMessage>{errors.title?.message}</FEIBErrorMessage>
              <FEIBInputLabel>個人年收入</FEIBInputLabel>
              <Controller
                name="income"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <FEIBSelect
                    {...field}
                    id="income"
                    name="income"
                    error={!!errors.income}
                  >
                    <FEIBOption value="" disabled>請選擇個人年收入</FEIBOption>
                    { renderOptionsList(incomeOptions) }
                  </FEIBSelect>
                )}
              />
              <FEIBErrorMessage>{errors.income?.message}</FEIBErrorMessage>
            </div>
            <Accordion title="注意事項" space="bottom">
              1.本次項目資料更新後，若客戶留存於本行之基本資料更新日距上次更新屆滿 6 個月，才會再次顯示。
              <br />
              2.如需變更其他項目請洽下列方式：
              <br />
              (1)通訊資料（通訊地址、電話）等，請臨櫃、客服電話（02-8073-1166）或本行網路銀行服務設定之基本資料變更。
              <br />
              (2)姓名、身分證字號、戶籍地址，公司負責人之資料已有變動．請親洽臨櫃辦理。
            </Accordion>
          </div>
          <div>
            <FEIBButton
              type="submit"
              style={{ marginBottom: '2.4rem' }}
            >
              確認
            </FEIBButton>
            <FEIBButton
              type="button"
              $bgColor={theme.colors.background.cancel}
              $color={theme.colors.text.dark}
              onClick={async () => {
                const data = getValues();
                const modifyData = {
                  jobCd: data.industry,
                  grade: data.title,
                  inCome: data.income,
                  actionCode: 0,
                };
                await updateRegularBasicInformation(modifyData);
                closeFunc();
              }}
              style={{ marginBottom: '2.4rem' }}
            >
              維持不變
            </FEIBButton>
            <FEIBButton
              type="button"
              $bgColor={theme.colors.background.cancel}
              $color={theme.colors.text.dark}
              onClick={resetForm}
              style={{ marginBottom: '2.4rem' }}
            >
              重新設定
            </FEIBButton>
          </div>
        </form>
      </RegularBasicInformationWrapper>
    </Layout>
  );
};

export default RegularBasicInformation;
