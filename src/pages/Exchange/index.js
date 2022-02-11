import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useGetEnCrydata } from 'hooks';
import { exchangeApi } from 'apis';

/* Elements */
import {
  FEIBSelect, FEIBOption, FEIBInputLabel, FEIBInput, FEIBRadio, FEIBRadioLabel, FEIBBorderButton, FEIBButton, FEIBErrorMessage,
} from 'components/elements';
import Header from 'components/Header';
import { RadioGroup } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { numberToChinese, currencySymbolGenerator } from 'utilities/Generator';
import Dialog from 'components/Dialog';
import Accordion from 'components/Accordion';
import InfoArea from 'components/InfoArea';
import ExchangeRules from './exchangeRules';
import ExchangeNotice from './exchangeNotice';
import ExchangeTable from './exchangeTable';

/* Styles */
import ExchangeWrapper from './exchange.style';

const Exchange = () => {
  // mock data
  const ntDollarsAccountsList = ['043000990000'];
  const foreignCurrencyAccountsList = ['00200700030001'];
  const propertyList = ['外幣互換兌入'];
  const employee = true;

  const history = useHistory();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    outAccount: yup
      .string()
      .required('請選擇轉出帳號'),
    currency: yup
      .string()
      .required('請選擇換匯幣別'),
    inAccount: yup
      .string()
      .required('請選擇轉入帳號'),
    property: yup
      .string()
      .required('請選擇匯款性質'),
    foreignBalance: yup
      .string()
      .when('outType', {
        is: (val) => val === '1',
        then: yup.string().required('請輸入金額'),
        otherwise: yup.string().notRequired(),
      }),
    ntDollorBalance: yup
      .string()
      .when('outType', {
        is: (val) => val === '2',
        then: yup.string().required('請輸入金額'),
        otherwise: yup.string().notRequired(),
      }),
    memo: yup.string(),
  });
  const {
    handleSubmit, control, formState: { errors }, watch, setValue,
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onBlur',
  });

  const [showTableDialog, setShowTableDialog] = useState(false);
  const [ntdAccountsList, setNtdAccountsList] = useState([]);
  const [frgnAccountsList, setFrgnAccountsList] = useState([]);
  const [outAccountList, setOutAccountList] = useState([]);
  const [inAccountList, setInAccountList] = useState([]);
  const [currencyTypeList, setCurrencyTypeList] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState({});
  const [propertiesList, setPropertiesList] = useState([]);
  const [ntDollorStr, setNtDollorStr] = useState('');
  const [foreignDollorStr, setForeignDollorStr] = useState('');

  // 查詢台幣帳號
  const getNtdAccountsList = async () => {
    const response = await exchangeApi.getNtdAccountsList({});
    console.log(response);
    if (response?.accounts.length > 0) {
      setNtdAccountsList(response?.accounts);
    }
  };

  // 查詢外幣帳號
  const getFcAccountsList = async () => {
    const response = await exchangeApi.getFrgnAccoutsList({});
    if (response?.length > 0) {
      console.log(response);
      setFrgnAccountsList(response);
      setInAccountList(response);
    }
  };

  // 取得可交易幣別清單
  const getCcyList = async () => {
    const response = await exchangeApi.getCcyList({});
    if (response?.length) {
      setCurrencyTypeList(response);
      setValue('currency', response[0].ccyId);
    }
  };

  // 取得交易性質列表
  const getEchgPropertyList = async () => {
    const response = await exchangeApi.getExchangePropertyList({
      trnsType: '',
      action: '1',
    });
    console.log(response);
  };

  const handleBalanceChange = (event) => {
    const targetName = event.target.name;
    const targetValue = event.target.value;
    setValue(targetName, targetValue);
    if (targetName === 'foreignBalance') {
      if (!targetValue) {
        setForeignDollorStr('');
      } else {
        setForeignDollorStr(`${currencySymbolGenerator(selectedCurrency?.ccyCd)}${targetValue}${numberToChinese(targetValue)}`);
      }
    }
    if (targetName === 'ntDollorBalance') {
      if (!targetValue) {
        setNtDollorStr('');
      } else {
        setNtDollorStr(`$${targetValue}${numberToChinese(targetValue)}`);
      }
    }
  };

  const handleTableToggle = () => {
    setShowTableDialog((prev) => !prev);
  };

  const handleExchangeTypeChange = (event) => {
    console.log(frgnAccountsList);
    console.log(ntdAccountsList);
    setValue('exchangeType', event.target.value);
    const outAccounts = outAccountList;
    const inAccounts = inAccountList;
    setOutAccountList(inAccounts);
    setInAccountList(outAccounts);
    setValue('outAccount', inAccounts[0]);
    setValue('inAccount', outAccounts[0]);
  };

  const ExchangeTableDialog = () => (
    <Dialog
      title="匯率"
      isOpen={showTableDialog}
      onClose={handleTableToggle}
      content={(<ExchangeTable />)}
      action={(
        <FEIBButton onClick={handleTableToggle}>確定</FEIBButton>
      )}
    />
  );

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    history.push('/exchange1');
  };

  const renderItemsList = (data) => (
    data.map((item) => (
      <FEIBOption key={item.acctId} value={item.acctId}>{item.acctId}</FEIBOption>
    ))
  );

  useGetEnCrydata();

  useEffect(() => {
    setOutAccountList(ntDollarsAccountsList);
    setInAccountList(foreignCurrencyAccountsList);
    setPropertiesList(propertyList);
    setValue('exchangeType', '1');
    setValue('outType', '1');
    setValue('foreignBalance', '');
    setValue('ntDollorBalance', '');
    setValue('outAccount', ntDollarsAccountsList[0]);
    setValue('inAccount', foreignCurrencyAccountsList[0]);
    setValue('property', propertyList[0]);
  }, []);

  useEffect(() => {
    getNtdAccountsList();
    getFcAccountsList();
    getCcyList();
    getEchgPropertyList();
  }, []);

  useEffect(() => {
    const selCcy = currencyTypeList.find((item) => item?.ccyId === watch('currency'));
    if (selCcy) {
      setSelectedCurrency(selCcy);
    }
  }, [watch('currency')]);

  return (
    <>
      <Header title="外幣換匯" />
      <ExchangeWrapper style={{ padding: '2.4rem 1.6rem 2.4rem 1.6rem' }}>
        <div className="borderBtnContainer">
          <FEIBBorderButton className="customSize" type="button" onClick={handleTableToggle}>
            外匯匯率查詢
          </FEIBBorderButton>
        </div>
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <section>
            <FEIBInputLabel className="exchangeTypeLabel">換匯種類</FEIBInputLabel>
            <Controller
              name="exchangeType"
              control={control}
              defaultValue="1"
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  aria-label="換匯種類"
                  id="exchangeType"
                  name="exchangeType"
                  defaultValue="1"
                  style={{ flexDirection: 'row', marginBottom: '.6rem' }}
                  onChange={handleExchangeTypeChange}
                >
                  <FEIBRadioLabel value="1" control={<FEIBRadio />} label="新臺幣轉外幣" />
                  <FEIBRadioLabel value="2" control={<FEIBRadio />} label="外幣轉新臺幣" />
                </RadioGroup>
              )}
            />
            <FEIBInputLabel>轉出帳號</FEIBInputLabel>
            <Controller
              name="outAccount"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBSelect
                  {...field}
                  id="outAccount"
                  name="outAccount"
                  error={!!errors.outAccount}
                >
                  { renderItemsList(outAccountList) }
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.outAccount?.message}</FEIBErrorMessage>
            <FEIBErrorMessage className="balance">可用餘額 NTD 10,000.00</FEIBErrorMessage>
            <FEIBInputLabel>換匯幣別</FEIBInputLabel>
            <Controller
              name="currency"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBSelect
                  {...field}
                  id="currency"
                  name="currency"
                  error={!!errors.currency}
                >
                  {
                    currencyTypeList.map((item) => (
                      <FEIBOption key={item?.ccyCd} value={item?.ccyId}>{ item?.ccyName }</FEIBOption>
                    ))
                  }
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.currency?.message}</FEIBErrorMessage>
            <FEIBErrorMessage className="balance">
              預估可換
              &nbsp;
              {
                selectedCurrency.ccyCd
              }
              &nbsp;
              333.33（實際金額以交易結果為準）
            </FEIBErrorMessage>
            <FEIBInputLabel>轉入帳號</FEIBInputLabel>
            <Controller
              name="inAccount"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBSelect
                  {...field}
                  id="inAccount"
                  name="inAccount"
                  error={!!errors.inAccount}
                >
                  { renderItemsList(inAccountList) }
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.inAccount?.message}</FEIBErrorMessage>
            <FEIBErrorMessage className="balance">
              可用餘額
              &nbsp;
              {
                selectedCurrency.ccyCd
              }
              &nbsp;
              222.00
            </FEIBErrorMessage>
            <Controller
              name="outType"
              control={control}
              defaultValue="1"
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  id="outType"
                  name="outType"
                  defaultValue="1"
                >
                  <FEIBRadioLabel
                    className="outTypeRadioLabel"
                    value="1"
                    control={<FEIBRadio />}
                    label={`希望${watch('exchangeType') === '2' ? '轉出' : '轉入'}${selectedCurrency?.ccyName}`}
                  />
                  <Controller
                    name="foreignBalance"
                    defaultValue=""
                    control={control}
                    render={({ balanceField }) => (
                      <>
                        <FEIBInput
                          {...balanceField}
                          type="text"
                          inputMode="numeric"
                          id="foreignBalance"
                          name="foreignBalance"
                          placeholder={`請輸入${watch('exchangeType') === '2' ? '轉出' : '轉入'}金額`}
                          error={!!errors.foreignBalance}
                          disabled={watch('outType') !== '1'}
                          onChange={handleBalanceChange}
                          inputProps={{
                            maxLength: 9,
                            autoComplete: 'off',
                          }}
                        />
                        <div className="balanceLayout">{foreignDollorStr}</div>
                      </>
                    )}
                  />
                  <FEIBErrorMessage>{errors.foreignBalance?.message}</FEIBErrorMessage>
                  <FEIBRadioLabel className="outTypeRadioLabel" value="2" control={<FEIBRadio />} label={`希望${watch('exchangeType') === '2' ? '轉入' : '轉出'}新臺幣`} />
                  <Controller
                    name="ntDollorBalance"
                    defaultValue=""
                    control={control}
                    render={({ balanceField }) => (
                      <>
                        <FEIBInput
                          {...balanceField}
                          autoComplete="off"
                          type="text"
                          inputMode="numeric"
                          id="ntDollorBalance"
                          name="ntDollorBalance"
                          placeholder={`請輸入${watch('exchangeType') === '2' ? '轉入' : '轉出'}金額`}
                          error={!!errors.ntDollorBalance}
                          disabled={watch('outType') !== '2'}
                          onChange={handleBalanceChange}
                          inputProps={{
                            maxLength: 9,
                            autoComplete: 'off',
                          }}
                        />
                        <div className="balanceLayout">{ntDollorStr}</div>
                      </>
                    )}
                  />
                  <FEIBErrorMessage>{errors.ntDollorBalance?.message}</FEIBErrorMessage>
                </RadioGroup>
              )}
            />
            <FEIBInputLabel>匯款性質</FEIBInputLabel>
            <Controller
              name="property"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBSelect
                  {...field}
                  id="property"
                  name="property"
                  error={!!errors.property}
                >
                  { renderItemsList(propertiesList) }
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.property?.message}</FEIBErrorMessage>
            <FEIBInputLabel>備註</FEIBInputLabel>
            <Controller
              name="memo"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBInput
                  {...field}
                  autoComplete="off"
                  type="text"
                  id="memo"
                  name="memo"
                  placeholder="請輸入文字"
                  error={!!errors.memo}
                />
              )}
            />
            <FEIBErrorMessage>{errors.memo?.message}</FEIBErrorMessage>
            <Accordion title="外幣換匯規範" space="bottom">
              <ExchangeRules />
            </Accordion>
            <Accordion space="bottom">
              <ExchangeNotice />
            </Accordion>
            {
              employee && (<InfoArea>換匯匯率將依據本行員工優惠匯率進行交易</InfoArea>)
            }
            <div className="submitBtn">
              <FEIBButton
                type="submit"
              >
                同意條款並確認
              </FEIBButton>
            </div>
          </section>
        </form>
        <ExchangeTableDialog />
      </ExchangeWrapper>
    </>
  );
};

export default Exchange;
