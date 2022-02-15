/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useGetEnCrydata } from 'hooks';
import { exchangeApi } from 'apis';
import { closeFunc } from 'utilities/BankeePlus';

/* Elements */
import {
  FEIBSelect, FEIBOption, FEIBInputLabel, FEIBInput, FEIBRadio, FEIBRadioLabel, FEIBBorderButton, FEIBButton, FEIBErrorMessage,
} from 'components/elements';
import Header from 'components/Header';
import { RadioGroup } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { numberToChinese, currencySymbolGenerator, toCurrency } from 'utilities/Generator';
import Dialog from 'components/Dialog';
import Accordion from 'components/Accordion';
import InfoArea from 'components/InfoArea';
import ExchangeRules from './exchangeRules';
import ExchangeNotice from './exchangeNotice';
import ExchangeTable from './exchangeTable';

/* Styles */
import ExchangeWrapper from './exchange.style';

const Exchange = () => {
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
    handleSubmit, control, formState: { errors }, watch, setValue, getValues,
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onBlur',
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [ntdAccountsList, setNtdAccountsList] = useState([]);
  const [frgnAccountsList, setFrgnAccountsList] = useState([]);
  const [currencyTypeList, setCurrencyTypeList] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState({});
  const [propertiesList, setPropertiesList] = useState([]);
  const [ntDollorStr, setNtDollorStr] = useState('');
  const [foreignDollorStr, setForeignDollorStr] = useState('');

  // 查詢是否為行員
  const isEmployee = async () => {
    const response = await exchangeApi.isEmployee({});
    console.log(response);
  };

  // 查詢台幣帳號
  const getNtdAccountsList = async () => {
    const response = await exchangeApi.getNtdAccountsList({});
    if (response?.accounts.length > 0) {
      setNtdAccountsList(response?.accounts);
      setValue('outAccount', response?.accounts[0].accountId);
      // setValue('inAccount', outAccounts[0]);
    }
  };

  // 查詢外幣帳號
  const getFcAccountsList = async () => {
    const response = await exchangeApi.getFrgnAccoutsList({});
    if (response?.length > 0) {
      setFrgnAccountsList(response);
      setValue('inAccount', response[0].acctId);
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
  const getEchgPropertyList = async (trnsType, init) => {
    const response = await exchangeApi.getExchangePropertyList({
      trnsType,
      action: '1',
    });
    if (response.message) {
      setDialogMessage(response.message);
      setOpenDialog(true);
    } else {
      setPropertiesList(response);
      setValue('property', response[0].leglCode);
      if (init) {
        getNtdAccountsList();
        getFcAccountsList();
        getCcyList();
        isEmployee();
      }
    }
  };

  // 處理訊息彈窗關閉
  const handleCloseDialog = () => {
    setOpenDialog(false);
    closeFunc();
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

  // 換匯種類變更
  const handleExchangeTypeChange = (event) => {
    setValue('exchangeType', event.target.value);
    getEchgPropertyList(event.target.value);
    const { inAccount, outAccount } = getValues();
    setValue('outAccount', inAccount);
    setValue('inAccount', outAccount);
  };

  const onSubmit = async (data) => {
    const {
      currency,
      exchangeType,
      foreignBalance,
      ntDollorBalance,
      inAccount,
      memo,
      outAccount,
      outType,
      property,
    } = data;
    const param = {
      trnsType: exchangeType,
      outAcct: outAccount,
      inAcct: inAccount,
      ccyCd: selectedCurrency.ccyCd,
      trfCcyCd: outType === '1' ? selectedCurrency.ccyCd : 'NTD',
      trfAmt: outType === '1' ? foreignBalance : ntDollorBalance,
      bankerCd: '',
    };
    const response = await exchangeApi.getRate(param);
    if (!response.message) {
      const confirmData = {
        ...response,
        memo,
        leglCode: property,
        leglDesc: propertiesList.find((item) => item.leglCode === property).leglDesc,
      };
      history.push('/exchange1', { confirmData });
    }
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

  const renderDialog = () => (
    <Dialog
      isOpen={openDialog}
      onClose={handleCloseDialog}
      content={<p>{ dialogMessage }</p>}
      action={(
        <FEIBButton onClick={handleCloseDialog}>確認</FEIBButton>
      )}
    />
  );

  const renderNTAccountOption = (data) => (
    data.map((item) => (
      <FEIBOption key={item.accountId} value={item.accountId}>{item.accountId}</FEIBOption>
    ))
  );

  const renderFrgnAccountOption = (data) => (
    data.map((item) => (
      <FEIBOption key={item.acctId} value={item.acctId}>{item.acctId}</FEIBOption>
    ))
  );

  // const renderItemsList = (data) => (
  //   data.map((item) => (
  //     <FEIBOption key={item.acctId} value={item.acctId}>{item.acctId}</FEIBOption>
  //   ))
  // );

  const renderTrnsTypeList = (data) => (
    data.map((item) => (
      <FEIBOption key={item.leglCode} value={item.leglCode}>{item.leglDesc}</FEIBOption>
    ))
  );

  const renderNTBlance = () => (
    <FEIBErrorMessage className="balance">
      可用餘額 NTD&nbsp;
      {
        toCurrency(ntdAccountsList.find((item) => (
          watch('exchangeType') === '1' ? item.accountId === watch('outAccount') : item.accountId === watch('inAccount')
        ))?.accountBalx)
      }
    </FEIBErrorMessage>
  );

  const renderFrgnBalance = () => (
    <FEIBErrorMessage className="balance">
      可用餘額
      &nbsp;
      {
        selectedCurrency.ccyCd
      }
      &nbsp;
      {
        frgnAccountsList.find((item) => (
          watch('exchangeType') === '1' ? item.acctId === watch('inAccount') : item.acctId === watch('outAccount')
        ))?.details.find((item) => item.ccyCd === selectedCurrency.ccyCd)?.acctBalx || 0
      }
    </FEIBErrorMessage>
  );

  useGetEnCrydata();

  useEffect(() => {
    // setOutAccountList(ntDollarsAccountsList);
    // setInAccountList(foreignCurrencyAccountsList);
    // setPropertiesList(propertyList);
    setValue('exchangeType', '1');
    setValue('outType', '1');
    setValue('foreignBalance', '');
    setValue('ntDollorBalance', '');
    // setValue('outAccount', ntDollarsAccountsList[0]);
    // setValue('inAccount', foreignCurrencyAccountsList[0]);
    // setValue('property', propertyList[0]);
  }, []);

  useEffect(() => {
    getEchgPropertyList('1', true);
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
                  {
                    watch('exchangeType') === '1'
                      ? (renderNTAccountOption(ntdAccountsList))
                      : (renderFrgnAccountOption(frgnAccountsList))
                  }
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.outAccount?.message}</FEIBErrorMessage>
            {
              watch('exchangeType') === '1'
                ? (renderNTBlance())
                : (renderFrgnBalance())
            }
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
                  {
                    watch('exchangeType') === '1'
                      ? (renderFrgnAccountOption(frgnAccountsList))
                      : (renderNTAccountOption(ntdAccountsList))
                  }
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.inAccount?.message}</FEIBErrorMessage>
            {
              watch('exchangeType') === '1'
                ? (renderFrgnBalance())
                : (renderNTBlance())
            }
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
                      <div>
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
                      </div>
                    )}
                  />
                  <FEIBErrorMessage>{errors.foreignBalance?.message}</FEIBErrorMessage>
                  <FEIBRadioLabel className="outTypeRadioLabel" value="2" control={<FEIBRadio />} label={`希望${watch('exchangeType') === '2' ? '轉入' : '轉出'}新臺幣`} />
                  <Controller
                    name="ntDollorBalance"
                    defaultValue=""
                    control={control}
                    render={({ balanceField }) => (
                      <div>
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
                      </div>
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
                  { renderTrnsTypeList(propertiesList) }
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
        { renderDialog() }
      </ExchangeWrapper>
    </>
  );
};

export default Exchange;
