import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBInputLabel,
  FEIBSelect,
  FEIBOption,
  FEIBErrorMessage,
} from 'components/elements';
import ConfirmButtons from 'components/ConfirmButtons';
import Accordion from 'components/Accordion';
// import PasswordInput from 'components/PasswordInput';
// import { passwordValidation } from 'utilities/validation';
/* Styles */
import RegularBasicInformationWrapper from './regularBasicInformation.style';

const RegularBasicInformation = () => {
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
    // ...passwordValidation,
  });
  const {
    handleSubmit, control, formState: { errors }, getValues, reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 跳轉確認頁
  const toConfirmPage = () => {
    history.push('/regularBasicInformation1');
  };

  // 更新個人資料
  const modifyPersonalData = async () => {
    const data = getValues();
    console.log(data);
    toConfirmPage();
  };

  // 點擊確認按鈕
  const onSubmit = () => {
    modifyPersonalData();
  };

  // 點擊重新設定
  const resetForm = () => {
    reset({
      industry: '1',
      title: '1',
      income: '1',
    });
  };

  useCheckLocation();
  usePageInfo('/api/regularBasicInformation');

  useEffect(() => {
    reset({
      industry: '1',
      title: '1',
      income: '1',
    });
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
                  <FEIBOption value="1">金融業</FEIBOption>
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
                  <FEIBOption value="1">一般職員</FEIBOption>
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
                  <FEIBOption value="1">50~80 萬</FEIBOption>
                  <FEIBOption value="2">80~120 萬</FEIBOption>
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
