import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import { regularBasicInformationApi } from 'apis';
import { goToFunc } from 'utilities/BankeePlus';

/* Elements */
import {
  FEIBInputLabel,
  FEIBSelect,
  FEIBOption,
  FEIBErrorMessage,
} from 'components/elements';
import ConfirmButtons from 'components/ConfirmButtons';
import Accordion from 'components/Accordion';
import { setIsOpen, setCloseCallBack, setResultContent } from 'pages/ResultDialog/stores/actions';

/* Styles */
import RegularBasicInformationWrapper from './regularBasicInformation.style';

const RegularBasicInformation = () => {
  const dispatch = useDispatch();
  const history = useHistory();
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
    // handleSubmit, control, formState: { errors }, getValues, reset, setValue,
    handleSubmit, control, formState: { errors }, reset, setValue,
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
    // const jobsCodeResponse = await regularBasicInformationApi.getJobsCode({});
    // eslint-disable-next-line no-console
    // console.log(jobsCodeResponse);
    // if (!jobsCodeResponse.message) {
    //   const {
    //     grade, income, jobcd, gradeList, incomeList, jobList,
    //   } = jobsCodeResponse;
    //   setGradeOptions(gradeList);
    //   setIncomeOptions(incomeList);
    //   setJobOptions(jobList);
    //   setRegularBasicData({ grade, income, jobcd });
    //   setValue('industry', jobcd);
    //   setValue('title', grade);
    //   setValue('income', income);
    // } else {
    //   alert(jobsCodeResponse.message);
    // }
    const mockGradeList = [
      { code: '01', name: '法人董事' },
      { code: '02', name: '法人董事之董事長' },
      { code: '03', name: '董事長' },
    ];
    const mockIncomeList = [
      { code: '01', name: '30萬以下' },
      { code: '02', name: '30-50萬' },
      { code: '03', name: '50-80萬' },
    ];
    const mockJobList = [
      { code: '0301', name: '家管' },
      { code: '0302', name: '學生' },
      { code: '0303', name: '無、待業' },
    ];
    setGradeOptions(mockGradeList);
    setIncomeOptions(mockIncomeList);
    setJobOptions(mockJobList);
    const grade = mockGradeList[0].code;
    const income = mockIncomeList[0].code;
    const jobcd = mockJobList[0].code;
    setRegularBasicData({ grade, income, jobcd });
    setValue('industry', jobcd);
    setValue('title', grade);
    setValue('income', income);
  };

  // 關閉結果彈窗
  const handleCloseResultDialog = () => {
    try {
      goToFunc('home');
    } catch (error) {
      history.push('/');
    }
  };

  // 設定結果彈窗
  const setResultDialog = (result) => {
    let closeCallBack;
    if (result) closeCallBack = handleCloseResultDialog;
    else closeCallBack = () => {};
    dispatch(setResultContent({
      isSuccess: result,
      successTitle: '設定成功',
      successDesc: '基本資料變更成功',
      errorTitle: '設定失敗',
      errorCode: 'xxxx',
      errorDesc: '基本資料變更失敗',
    }));
    dispatch(setCloseCallBack(closeCallBack));
    dispatch(setIsOpen(true));
  };

  // 更新基本資料
  const modifyPersonalData = async () => {
    // const data = getValues();
    // const modifyData = {
    //   jobCd: data.industry,
    //   grade: data.title,
    //   inCome: data.income,
    // };
    // const modifyResponse = await regularBasicInformationApi.modifyRegularBasicInformation(modifyData);
    // const { grade, inCome, jobCd } = modifyResponse;
    // if (grade && inCome && jobCd) {
    //   toResultPage(true);
    // } else {
    //   toResultPage(false);
    // }
    const result = true;
    setResultDialog(result);
  };

  // 點擊確認按鈕
  const onSubmit = () => {
    modifyPersonalData();
  };

  // 建立選單
  const renderOptionsList = (data) => data.map((item) => (
    <FEIBOption key={item.code} value={item.code}>{item.name}</FEIBOption>
  ));

  useCheckLocation();
  usePageInfo('/api/regularBasicInformation');

  useEffect(() => {
    getJobsCode();
  }, []);

  return (
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
        <ConfirmButtons
          mainButtonValue="確認"
          subButtonValue="重新設定"
          subButtonOnClick={resetForm}
        />
      </form>
    </RegularBasicInformationWrapper>
  );
};

export default RegularBasicInformation;
