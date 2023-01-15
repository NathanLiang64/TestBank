import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { accountFormatter, dateToYMD } from 'utilities/Generator';
import { getAccountsList } from 'utilities/CacheData';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBInputLabel,
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
import { loadFuncParams } from 'utilities/AppScriptProxy';
import AccordionContent from './accordionContent';
import { getProfile, sendBankBookMail } from './api';

/* Styles */
import ExportBankBookWrapper from './exportBankBook.style';

const ExportBankBook = () => {
  const dispatch = useDispatch();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    account: yup
      .string()
      .required('請選擇匯出帳戶'),
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
  const [accountList, setAccountList] = useState([]);
  const [mail, setMail] = useState('');
  const [exportDateRange, setExportDateRange] = useState([new Date(), new Date()]);
  const [showDateRangeErrMsg, setShowDateRangeErrMsg] = useState(false);
  const [dateRangeErrorMessage, setDateRangeErrorMessage] = useState('');

  const setDateRange = (rangeType) => {
    let startDate;
    const date = new Date();
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
    setExportDateRange([startDate, date]);
  };

  const handleDatePickerClick = (range) => {
    setExportDateRange(range);
  };

  const checkDateRangePickerValid = () => {
    let valid = false;
    if (exportDateRange.length === 0) {
      setDateRangeErrorMessage('請選擇日期區間');
      setShowDateRangeErrMsg(true);
      return valid;
    }
    const differenceInTime = exportDateRange[1].getTime() - exportDateRange[0].getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    if (differenceInDays > 180) {
      setDateRangeErrorMessage('查詢區間不得超過六個月');
      setShowDateRangeErrMsg(true);
      return valid;
    }
    valid = true;
    return valid;
  };

  const onSubmit = async (data) => {
    dispatch(setWaittingVisible(true));
    if (data.outType === '2') {
      const valid = checkDateRangePickerValid();
      if (!valid) {
        return;
      }
    }
    const param = {
      conditions: {
        accountNo: data.account,
        startDate: dateToYMD(exportDateRange[0]),
        endDate: dateToYMD(exportDateRange[1]),
      },
      fileType: 1,
      pdfTemplateType: data.outType === '1' ? 1 : 3,
    };
    const response = await sendBankBookMail(param);
    dispatch(setWaittingVisible(false));
    if (response?.data === 'Send mail success!') {
      history.push('/C008001', { data: { mail, success: true } });
    } else {
      history.push('/C008001', { data: { success: false } });
    }
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 取得帳號清單 (只匯出台幣相關帳戶)
    getAccountsList('MSC', async (accounts) => { // 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
      setAccountList(accounts);
      const params = await loadFuncParams();
      if (params) setValue('account', params.accountNo);
      else setValue('account', accounts[0].accountNo);
    });

    // 取得 Email
    const { email } = await getProfile();
    setMail(email || '');

    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="匯出存摺">
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
                    accountList.map((item) => (
                      <FEIBOption value={item.accountNo} key={item.accountNo}>
                        {`${accountFormatter(item.accountNo)}  ${item.alias}`}
                      </FEIBOption>
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
                value={exportDateRange}
                {...datePickerLimit}
                onChange={handleDatePickerClick}
              />
              <FEIBErrorMessage>
                {showDateRangeErrMsg && dateRangeErrorMessage}
              </FEIBErrorMessage>
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
              <br />
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
    </Layout>
  );
};

export default ExportBankBook;
