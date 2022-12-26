/**
 * /* eslint-disable no-unused-vars
 *
 * @format
 */

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  isEmployee,
  getAccountsList,
  getCcyList,
  getExchangePropertyList,
  getExchangeRateInfo,
} from 'pages/E00100_Exchange/api';

/* Elements */
import {
  FEIBSelect,
  FEIBOption,
  FEIBInputLabel,
  FEIBInput,
  FEIBRadio,
  FEIBRadioLabel,
  FEIBBorderButton,
  FEIBButton,
  FEIBErrorMessage,
} from 'components/elements';
import Layout from 'components/Layout/Layout';
import { RadioGroup } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { numberToChinese, currencySymbolGenerator, toCurrency } from 'utilities/Generator';
// TODO: 移除
// import Dialog from 'components/Dialog';
import Accordion from 'components/Accordion';
import InfoArea from 'components/InfoArea';
import { showCustomPrompt, showInfo } from 'utilities/MessageModal';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import E00100Rules from './E00100_Rules';
import E00100Notice from './E00100_Notice';
import E00100Table from './E00100_Table';

/* Styles */
import ExchangeWrapper from './E00100.style';

/**
 * E00100 外幣換匯首頁
 */

const E00100 = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    outAccount: yup.string().required('請選擇轉出帳號'),
    currency: yup.string().required('請選擇換匯幣別'),
    inAccount: yup.string().required('請選擇轉入帳號'),
    property: yup.string().required('請選擇匯款性質'),
    foreignBalance: yup.string().when('outType', {
      is: (val) => val === '1',
      then: yup.string().required('請輸入金額'),
      otherwise: yup.string().notRequired(),
    }),
    ntDollorBalance: yup.string().when('outType', {
      is: (val) => val === '2',
      then: yup.string().required('請輸入金額'),
      otherwise: yup.string().notRequired(),
    }),
    memo: yup.string(),
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      exchangeType: '1',
      outType: '1',
      foreignBalance: '',
      ntDollorBalance: '',
    },
    resolver: yupResolver(schema),
    reValidateMode: 'onBlur',
  });

  // TODO: 移除
  // const [openDialog, setOpenDialog] = useState(false);
  // const [dialogMessage, setDialogMessage] = useState('');
  // const [isCloseFunc, setIsCloseFunc] = useState(false);
  // const [showTableDialog, setShowTableDialog] = useState(false);
  const [banker, setBanker] = useState({});
  const [accountsList, setAccountsList] = useState([]);
  // TODO: 移除
  // const [ntdAccountsList, setNtdAccountsList] = useState([]);
  // const [frgnAccountsList, setFrgnAccountsList] = useState([]);
  const [currencyTypeList, setCurrencyTypeList] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState({});
  const [propertiesList, setPropertiesList] = useState([]);
  const [ntDollorStr, setNtDollorStr] = useState('');
  const [foreignDollorStr, setForeignDollorStr] = useState('');

  // TODO: 移除
  // 設定訊息彈窗
  // const handleSetDialog = (msg) => {
  //   setDialogMessage(msg);
  //   setIsCloseFunc(isCloseFun);
  //   setOpenDialog(true);
  //   showInfo(msg);
  // };

  // TODO: 移除
  // 處理訊息彈窗關閉
  // const handleCloseDialog = () => {
  //   // setOpenDialog(false);
  //   if (isCloseFunc) {
  //     closeFunc();
  //   }
  // };

  // 查詢是否為行員
  const getIsEmployee = async () => {
    const response = await isEmployee({});
    if (response.bankerCd) {
      setBanker(response);
    }
  };

  // 查詢所有帳戶資料
  const fetchAccountsList = async () => {
    const response = await getAccountsList('MSF');
    if (response?.length > 0) {
      const accounts = response.filter((acct) => acct.transable); // 要排除不可轉帳的帳號。
      setAccountsList(accounts);
      setValue('outAccount', accounts[0].account);
    }
  };

  // 取得可交易幣別清單
  const fetchCcyList = async () => {
    const response = await getCcyList({ currency: '' });
    if (response?.length) {
      setCurrencyTypeList(response);
      setValue('currency', response[0].Currency);
    }
  };

  // 取得交易性質列表
  const getEchgPropertyList = async (trnsType, init) => {
    const response = await getExchangePropertyList({
      trnsType,
      action: '1',
    });

    if (Array.isArray(response)) {
      setPropertiesList(response);
      setValue('property', response[0].leglCode);
      if (init) {
        fetchAccountsList();
        // getNtdAccountsList();
        // getFcAccountsList();
        fetchCcyList();
        getIsEmployee();
      }
    }
  };

  const handleBalanceChange = (event) => {
    const targetName = event.target.name;
    const targetValue = event.target.value;
    setValue(targetName, targetValue);
    if (targetName === 'foreignBalance') {
      if (!targetValue) {
        setForeignDollorStr('');
      } else {
        setForeignDollorStr(
          `${currencySymbolGenerator(selectedCurrency?.ccyCd)}${targetValue}${numberToChinese(
            targetValue,
          )}`,
        );
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

  // TODO: 移除
  // const handleTableToggle = () => {
  //   setShowTableDialog((prev) => !prev);
  // };

  // 換匯種類變更
  const handleExchangeTypeChange = (event) => {
    setValue('exchangeType', event.target.value);
    getEchgPropertyList(event.target.value);
    const { inAccount, outAccount } = getValues();
    setValue('outAccount', inAccount);
    setValue('inAccount', outAccount);
  };

  // 取得帳戶餘額
  const getAmount = (currency) => accountsList.find((item) => (
    item.account === watch((currency === 'NTD') ? 'outAccount' : 'inAccount')
  ))?.details.find((item) => (item.currency === selectedCurrency.ccyCd))?.balance || '0';

  // TODO: 移除
  // // 取得台幣帳戶餘額
  // const getNTDAmt = () => ntdAccountsList.find((item) => (
  //   watch('exchangeType') === '1' ? item.accountId === watch('outAccount') : item.accountId === watch('inAccount')
  // ))?.accountBalx;

  // TODO: 移除
  // // 取得外幣帳戶餘額
  // const getFrgnAmt = () => frgnAccountsList.find((item) => (
  //   watch('exchangeType') === '1' ? item.accountId === watch('inAccount') : item.accountId === watch('outAccount')
  // ))?.details.find((item) => item.ccyCd === selectedCurrency.ccyCd)?.acctBalx || '0';

  // 檢查是否超出餘額
  const checkOverAmt = (data) => {
    const amt = Number(data);
    // 判斷台轉外, 外轉台
    const exchangeType = watch('exchangeType') === '1' ? 'n2f' : 'f2n';
    // 判斷幣別
    const isNTD = watch('outType') === '2';
    const ntAmt = getAmount('NTD');
    const frgnAmt = Number(getAmount(selectedCurrency.ccyCd).replace(/,/gi, ''));
    // 如果是台轉外，檢查是否超過台幣餘額
    if (exchangeType === 'n2f') {
      if (isNTD) {
        return amt > ntAmt;
      }
      if (!isNTD) {
        return amt > ntAmt / selectedCurrency.sellRate;
      }
    }
    // 如果是外轉台，檢查是否超過外幣餘額
    if (exchangeType === 'f2n') {
      if (isNTD) {
        return amt / selectedCurrency.sellRate > frgnAmt;
      }
      if (!isNTD) {
        return amt > frgnAmt;
      }
    }
    return true;
  };

  // 取得換匯資訊與密文
  const onSubmit = async (data) => {
    const {
      // currency,
      exchangeType,
      foreignBalance,
      ntDollorBalance,
      inAccount,
      memo,
      outAccount,
      outType,
      property,
    } = data;
    const trfAmt = outType === '1' ? foreignBalance : ntDollorBalance;
    const checkOverResult = checkOverAmt(trfAmt);
    if (checkOverResult) {
      await showInfo('您輸入的金額已超過轉出帳號的餘額');
      // TODO: 移除
      // handleSetDialog('您輸入的金額已超過轉出帳號的餘額');
      return;
    }
    // switchLoading(true);
    dispatch(setWaittingVisible(true));
    const param = {
      trnsType: exchangeType,
      outAcct: outAccount,
      inAcct: inAccount,
      ccyCd: selectedCurrency.ccyCd,
      trfCcyCd: outType === '1' ? selectedCurrency.ccyCd : 'NTD',
      trfAmt,
      bankerCd: banker?.bankerCd || '',
    };
    const response = await getExchangeRateInfo(param);
    dispatch(setWaittingVisible(false));
    // switchLoading(false);
    if (!response.message) {
      const confirmData = {
        ...response,
        memo,
        leglCode: property,
        leglDesc: propertiesList.find((item) => item.leglCode === property).leglDesc,
        outAccountAmount:
          exchangeType === '1'
            ? getAmount('NTD')
            : Number(getAmount(selectedCurrency.ccyCd).replace(/,/gi, '')),
      };
      history.push('/E001001', { ...confirmData });
    } else {
      // TODO: 移除
      // handleSetDialog(response.message);
      await showInfo(response.message);
    }
  };

  const generateAvailibleAmount = () => {
    const ntAmt = getAmount('NTD');
    const frgnAmt = Number(getAmount(selectedCurrency.ccyCd).replace(/,/gi, ''));
    if (watch('exchangeType') === '1') {
      return toCurrency(Math.round(ntAmt / selectedCurrency.sellRate) || 0);
    }
    return toCurrency(Math.round(frgnAmt * selectedCurrency.sellRate) || 0);
  };

  // TODO: 移除
  // const ExchangeTableDialog = () => (
  //   <Dialog
  //     title="匯率"
  //     isOpen={showTableDialog}
  //     onClose={handleTableToggle}
  //     content={<ExchangeTable />}
  //     action={<FEIBButton onClick={handleTableToggle}>確定</FEIBButton>}
  //   />
  // );

  // const renderDialog = () => (
  //   <Dialog
  //     isOpen={openDialog}
  //     onClose={handleCloseDialog}
  //     content={<p>{dialogMessage}</p>}
  //     action={<FEIBButton onClick={handleCloseDialog}>確認</FEIBButton>}
  //   />
  // );

  /**
   * 列出帳戶清單。
   * @param {*} showTwdAccount 若為 true 則列出台幣帳戶清單，反之則列出外幣帳戶清單。
   */
  const renderAccountOption = (showTwdAccount) => (
    accountsList
      .filter((acct) => acct.details.find((item) => showTwdAccount && item.currency === 'NTD'))
      .map((item) => (
        <FEIBOption key={item.account} value={item.account}>{item.account}</FEIBOption>
      ))
  );

  const renderTrnsTypeList = (data) => (
    data.map((item) => (
      <FEIBOption key={item.leglCode} value={item.leglCode}>{item.leglDesc}</FEIBOption>
    ))
  );

  const renderNTBlance = () => (
    <FEIBErrorMessage className="balance">
      可用餘額 NTD&nbsp;
      {toCurrency(getAmount('NTD') || 0)}
    </FEIBErrorMessage>
  );

  const renderFrgnBalance = () => (
    <FEIBErrorMessage className="balance">
      可用餘額 &nbsp;
      {selectedCurrency.ccyCd}
      &nbsp;
      {getAmount(selectedCurrency.ccyCd)}
    </FEIBErrorMessage>
  );

  // TODO: 移除
  // useEffect(() => {
  //   setValue('exchangeType', '1');
  //   setValue('outType', '1');
  //   setValue('foreignBalance', '');
  //   setValue('ntDollorBalance', '');
  // }, []);

  useEffect(() => {
    getEchgPropertyList('1', true);
  }, []);

  useEffect(() => {
    const selCcy = currencyTypeList.find((item) => item?.Currency === watch('currency'));
    if (selCcy) {
      setSelectedCurrency(selCcy);
    }
  }, [watch('currency')]);

  return (
    <Layout title="外幣換匯">
      <ExchangeWrapper style={{ padding: '2.4rem 1.6rem 2.4rem 1.6rem' }}>
        <div className="borderBtnContainer">
          <FEIBBorderButton
            className="customSize"
            type="button"
            onClick={() => showCustomPrompt({
              title: '匯率',
              message: <E00100Table />,
              okContent: '確定',
            })}
          >
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
                  {renderAccountOption(watch('exchangeType') === '1')}
                  {/*
                    watch('exchangeType') === '1'
                      ? (renderAccountOption(accountsList, watch('exchangeType')))
                      : (renderFrgnAccountOption(frgnAccountsList))
                  */}
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.outAccount?.message}</FEIBErrorMessage>
            {watch('exchangeType') === '1' ? renderNTBlance() : renderFrgnBalance()}
            <FEIBInputLabel>換匯幣別</FEIBInputLabel>
            <Controller
              name="currency"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBSelect {...field} id="currency" name="currency" error={!!errors.currency}>
                  {currencyTypeList.map((item) => (
                    <FEIBOption key={item?.Currency} value={item?.Currency}>
                      {item?.CurrencyName}
                      {item?.Currency}
                    </FEIBOption>
                  ))}
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.currency?.message}</FEIBErrorMessage>
            <FEIBErrorMessage className="balance">
              預估可換 &nbsp;
              {watch('exchangeType') === '1' ? selectedCurrency.ccyCd : 'NTD'}
              &nbsp;
              {generateAvailibleAmount()}
              （實際金額以交易結果為準）
            </FEIBErrorMessage>
            <FEIBInputLabel>轉入帳號</FEIBInputLabel>
            <Controller
              name="inAccount"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBSelect {...field} id="inAccount" name="inAccount" error={!!errors.inAccount}>
                  {renderAccountOption(watch('exchangeType') === '2')}
                  {/*
                    watch('exchangeType') === '1'
                      ? (renderFrgnAccountOption(frgnAccountsList))
                      : (renderNTAccountOption(ntdAccountsList))
                  */}
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.inAccount?.message}</FEIBErrorMessage>
            {watch('exchangeType') === '1' ? renderFrgnBalance() : renderNTBlance()}
            <Controller
              name="outType"
              control={control}
              defaultValue="1"
              render={({ field }) => (
                <RadioGroup {...field} id="outType" name="outType" defaultValue="1">
                  <FEIBRadioLabel
                    className="outTypeRadioLabel"
                    value="1"
                    control={<FEIBRadio />}
                    label={`希望${watch('exchangeType') === '2' ? '轉出' : '轉入'}${selectedCurrency?.ccyName || ''}`}
                  />
                  <Controller
                    name="foreignBalance"
                    defaultValue=""
                    control={control}
                    render={({ balanceField }) => (
                      <div>
                        <FEIBInput
                          {...balanceField}
                          type="number"
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
                  <FEIBRadioLabel
                    className="outTypeRadioLabel"
                    value="2"
                    control={<FEIBRadio />}
                    label={`希望${watch('exchangeType') === '2' ? '轉入' : '轉出'}新臺幣`}
                  />
                  <Controller
                    name="ntDollorBalance"
                    defaultValue=""
                    control={control}
                    render={({ balanceField }) => (
                      <div>
                        <FEIBInput
                          {...balanceField}
                          autoComplete="off"
                          type="number"
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
                <FEIBSelect {...field} id="property" name="property" error={!!errors.property}>
                  {renderTrnsTypeList(propertiesList)}
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
                  placeholder="請輸入備註"
                  error={!!errors.memo}
                />
              )}
            />
            <FEIBErrorMessage>{errors.memo?.message}</FEIBErrorMessage>
            <Accordion title="外幣換匯規範" space="bottom">
              <E00100Rules />
            </Accordion>
            <Accordion space="bottom">
              <E00100Notice />
            </Accordion>
            {banker.bankerCd && <InfoArea>換匯匯率將依據本行員工優惠匯率進行交易</InfoArea>}
            <div className="submitBtn">
              <FEIBButton type="submit">同意條款並確認</FEIBButton>
            </div>
          </section>
        </form>
        {/* TODO: 移除 */}
        {/* <ExchangeTableDialog /> */}
        {/* {renderDialog()} */}
      </ExchangeWrapper>
    </Layout>
  );
};

export default E00100;
