import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBInputLabel,
  // FEIBInput,
  FEIBSelect,
  FEIBOption,
  FEIBButton,
  FEIBRadioLabel,
  FEIBRadio,
  FEIBErrorMessage,
  FEIBBorderButton,
} from 'components/elements';
import { RadioGroup } from '@material-ui/core';
import DateRangePicker from 'components/DateRangePicker';
import Accordion from 'components/Accordion';
import InfoArea from 'components/InfoArea';
import AccordionContent from './accordionContent';

/* Styles */
import ExportBankBookWrapper from './exportBankBook.style';

const ExportBankBook = () => {
  const mockData = {
    accountsList: ['04300499031163', '04300499031164', '04300499031165'],
    mail: 'feib1688@gmail.com',
  };
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    account: yup
      .string()
      .required('請選擇匯出帳戶'),
    // ...passwordValidation,
  });
  const {
    handleSubmit, control, formState: { errors }, watch, setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const history = useHistory();

  const datePickerLimit = {
    minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 3)),
    maxDate: new Date(),
  };
  const [accountsList, setAccountsList] = useState([]);
  const [mail, setMail] = useState('');
  const [exportDateRange, setExportDateRange] = useState([]);

  const getAccountsListAndMail = () => {
    setAccountsList(mockData.accountsList);
    setValue('account', mockData.accountsList[0]);
    setMail(mockData.mail);
  };

  const setDateRange = (rangeType) => {
    let startDate;
    const endDate = new Date();
    switch (rangeType) {
      case 0:
        startDate = new Date(new Date().setDate(new Date().getDate() - 30));
        break;
      case 1:
        startDate = new Date(new Date().setDate(new Date().getDate() - 90));
        break;
      case 2:
        startDate = new Date(new Date().setDate(new Date().getDate() - 180));
        break;
      default:
    }
    setExportDateRange([startDate, endDate]);
  };

  const onSubmit = (data) => {
    console.log(data);
    history.push('exportBankBook1', { data: { mail, success: true } });
  };

  useCheckLocation();
  usePageInfo('/api/exportBankBook');

  useEffect(() => {
    getAccountsListAndMail();
  }, []);

  return (
    <ExportBankBookWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <FEIBInputLabel>請選擇匯出帳戶</FEIBInputLabel>
          <Controller
            name="account"
            defaultValue=""
            control={control}
            placeholder="請選擇匯出帳戶"
            render={({ field }) => (
              <FEIBSelect
                {...field}
                id="account"
                name="account"
                placeholder="請選擇匯出帳戶"
                error={!!errors.county}
              >
                <FEIBOption value="" disabled>請選擇匯出帳戶</FEIBOption>
                {
                  accountsList.map((item) => (
                    <FEIBOption key={item} value={item}>{item}</FEIBOption>
                  ))
                }
              </FEIBSelect>
            )}
          />
          <FEIBErrorMessage>{errors.account?.message}</FEIBErrorMessage>
          <Controller
            name="outType"
            control={control}
            defaultValue="1"
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-label="匯出種類"
                id="outType"
                name="outType"
                defaultValue="1"
              >
                <FEIBRadioLabel value="1" control={<FEIBRadio />} label="僅匯出存簿封面" />
                <FEIBRadioLabel value="2" control={<FEIBRadio />} label="匯出存簿封面與帳戶明細" />
              </RadioGroup>
            )}
          />
          <div className="datePickerContainer" style={{ display: watch('outType') === '2' ? 'block' : 'none', marginTop: '.9rem' }}>
            <DateRangePicker
              label="自訂搜尋日期區間"
              date={exportDateRange}
              {...datePickerLimit}
              onClick={(range) => setExportDateRange(range)}
            />
            <FEIBErrorMessage>{errors.dateRange?.message}</FEIBErrorMessage>
            <div className="tip">可查詢三年交易明細，查詢區間最多六個月</div>
            <div className="rangeBtnContainer">
              <FEIBBorderButton className="customSize" type="button" onClick={() => setDateRange(0)}>近一個月</FEIBBorderButton>
              <FEIBBorderButton className="customSize" type="button" onClick={() => setDateRange(1)}>近三個月</FEIBBorderButton>
              <FEIBBorderButton className="customSize" type="button" onClick={() => setDateRange(2)}>近六個月</FEIBBorderButton>
            </div>
          </div>
          <Accordion space="both">
            <AccordionContent />
          </Accordion>
        </div>
        <div>
          <InfoArea space="bottom">
            將匯出至留存信箱：
            { mail }
            若需更改留存信箱，請至基本資料變更進行修改
          </InfoArea>
          <FEIBButton
            type="submit"
          >
            確認
          </FEIBButton>
        </div>
      </form>
    </ExportBankBookWrapper>
  );
};

export default ExportBankBook;
