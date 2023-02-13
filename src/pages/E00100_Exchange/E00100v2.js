/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/jsx-max-props-per-line */
import { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router';
import { RadioGroup } from '@material-ui/core';
import {
  isEmployee,
  getCcyList,
  getExchangePropertyList,
  getExchangeRateInfo,
} from 'pages/E00100_Exchange/api';
import { Func } from 'utilities/FuncID';
import { getAccountsList } from 'utilities/CacheData';

/* Elements */
import {
  FEIBBorderButton, FEIBButton, FEIBHintMessage, FEIBRadio, FEIBRadioLabel,
} from 'components/elements';
import Layout from 'components/Layout/Layout';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toCurrency, getCurrenyInfo } from 'utilities/Generator';
import Accordion from 'components/Accordion';
import InfoArea from 'components/InfoArea';
import { showCustomPrompt, showInfo } from 'utilities/MessageModal';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { RadioGroupField } from 'components/Fields/radioGroupField';
import { CurrencyInputField, DropdownField, TextInputField } from 'components/Fields';

import { loadFuncParams } from 'utilities/AppScriptProxy';
import { getAccountsList } from 'utilities/CacheData';
import { E00100Notice, E00100Table } from './E00100_Content';

/* Styles */
import { ExchangeWrapper } from './E00100.style';

/**
 * E00100 外幣換匯首頁
 */

const E00100 = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [viewModel] = useState({
    mode: 1,
    ntdAccounts: [], // 台幣帳戶清單
    frgnAccount: [], // 外幣帳戶
    currencies: [], //
    properties: {}, // {1: [台幣匯款性質]}, {2: [外幣匯款性質]}
    inAccount: null,
    outAccount: null,
    currency: null,
    exRateBoard: null, // 匯率看版
  });

  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    // outAccount: yup.string().required('請選擇轉出帳號'),
    currency: yup.string().required('請選擇換匯幣別'),
    // inAccount: yup.string().required('請選擇轉入帳號'),
    property: yup.string().required('請選擇匯款性質'),
    // outType: yup.number().required(),
    exchangeAmount: yup.number().required('請輸入金額'),
    // memo: yup.string(),
  });
  const {
    handleSubmit, control, watch, reset, getValues, setValue, setError, clearErrors, // formState: { errors },
  } = useForm({
    defaultValues: {
      mode: 0, // 0.尚未初始化, 1.新臺幣轉外幣, 2.外幣轉新臺幣
      outAccount: '',
      inAccount: '',
      currency: '',
      outType: 1,
      exchangeAmount: '',
      property: '',
      memo: '',
    },
    resolver: yupResolver(schema),
    reValidateMode: 'onBlur',
  });

  const {
    inAccount, outAccount, currency, exchangeAmount, outType,
  } = watch(); // 會吃掉 onChanged 事件！

  /**
   * 初始化
   */
  useEffect(async () => {
    if (viewModel.loaded) return;

    dispatch(setWaittingVisible(true));

    // 確認使用者是否為行員
    const api1 = isEmployee().then((isBanker) => { viewModel.isBanker = isBanker; });

    // 取得帳戶列表
    const api2 = getAccountsList('MSF', (accounts) => {
      accounts.filter(({transable}) => !!transable) // 篩選出有約定的帳戶
        .forEach((acct) => {
          if (acct.acctType === 'F') {
            viewModel.frgnAccount.push(acct);
          } else viewModel.ntdAccounts.push(acct);
        });
    }, true);

    // 取得幣別列表
    const api3 = getCcyList().then((ccys) => { // 回傳的資料的 key 不是 camelCase
      viewModel.currencies = ccys?.length ? ccys : [];
    });

    Promise.all([api1, api2, api3]).then(() => {
      viewModel.loaded = true; // 避免重複載入資料
      onModeChanged(1);
      reset({
        mode: 1,
        outAccount: viewModel.outAccount.accountNo,
        inAccount: viewModel.inAccount.accountNo,
        currency: '', // 沒有預設的必要
        property: '', // 沒有預設的必要
        outType: 1,
      });

      dispatch(setWaittingVisible(false));
    });
  }, []);

  // TODO 確認轉出帳號是否有可換匯的約定帳號
  // useEffect(() => {
  //   if (outAccount) {
  //     const foundAccount = accountsList.find(({ account }) => account === outAccount);
  //     // 進入此頁後同一個轉出帳號只要出現過1次提示，則不再出現，重新進入此頁則重新計算。
  //     if (!(outAccount in transableObj)) {
  //       setTransableObj((prevObj) => ({ ...prevObj, [outAccount]: foundAccount.transable }));
  //       // 若選擇的轉出帳號 trasnable ===false，需要提示使用者該帳號沒有可換匯的約定帳號
  //       if (!foundAccount.transable) {
  //         showCustomPrompt({
  //           message: '該帳號目前尚未擁有可進行換匯的約定轉帳帳號，請先進行約定本人轉帳帳號後，再進行換匯。',
  //           onOk: () => window.open('https://eauth.feib.com.tw/AccountAgreement/sameId/index', '_blank'), // 可能會無法打開，且連結是否應該 hardcode 待確認
  //           okContent: '立即設定',
  //           onCancel: () => {},
  //         });
  //       }
  //     }
  //   }
  // }, [outAccount, accountsList]);

  /**
   *
   * @param {*} newMode
   */
  const onModeChanged = (newMode) => {
    const values = getValues();
    viewModel.mode = newMode;
    viewModel.outAccount = (getAccountList(0).length > 0) ? getAccountList(0)[0].data : '';
    viewModel.inAccount = (getAccountList(1).length > 0) ? getAccountList(1)[0].data : '';
    // console.log('viewModel', viewModel);
    reset({
      ...values,
      mode: newMode,
      outAccount: '',
      inAccount: '',
    });
  };

  useEffect(() => {
    if (outAccount === '' && viewModel.outAccount) {
      setValue('outAccount', viewModel.outAccount.accountNo);
    } else {
      viewModel.outAccount = getAccountList(0).find((item) => item.data.accountNo === outAccount)?.data;
    }
  }, [outAccount]);

  useEffect(() => {
    // TODO 轉入帳號必需是轉出帳號的約定帳號
    //      時有同ID互轉，是否就不用檢查了？
    if (inAccount === '' && viewModel.inAccount) {
      setValue('inAccount', viewModel.inAccount.accountNo);
    } else {
      viewModel.inAccount = getAccountList(1).find((item) => item.data.accountNo === inAccount)?.data;
    }
  }, [inAccount]);

  /**
   * 檢查是否超出餘額
   */
  useEffect(() => {
    let maxAmount;
    if (viewModel.mode !== outType) {
      const {balance} = getBalance(0); // 取出轉出帳戶的餘額。
      maxAmount = balance;
    } else {
      maxAmount = viewModel.maxExchange;
    }
    if (exchangeAmount > maxAmount) {
      setError('exchangeAmount', { type: 'custom', message: '金額已超過轉出帳號的餘額' });
    } else clearErrors('exchangeAmount');
  }, [exchangeAmount, outType]);

  // 取得換匯資訊與密文
  const onSubmit = async (values) => {
    // const trfAmt = values.outType === '1' ? values.foreignBalance : values.ntDollorBalance;
    // const checkOverResult = checkOverAmt(trfAmt);
    // if (checkOverResult) {
    //   await showInfo('您輸入的金額已超過轉出帳號的餘額');
    //   return;
    // }

    // dispatch(setWaittingVisible(true));
    // const response = await getExchangeRateInfo(); // BUG 這是取匯率清單，並不是取得換匯掛號的傳回資訊！
    // dispatch(setWaittingVisible(false));

    // if (!response.message) {
    //   const modelx = {
    //     trnsType: mode, // TODO trnsType is String
    //     outAcct: values.outAccount,
    //     inAcct: values.inAccount,
    //     ccyCd: values.currency,
    //     trfCcyCd: values.outType === '1' ? values.currency : 'NTD',
    //     trfAmt, // 目前是帶字串過去，是否應該帶數字?
    //     isEmployee: banker, // TODO 由 Conotroller 從 token 中取出。
    //   };

    //   const confirmData = {
    //     ...modelx,
    //     ...response,
    //     memo: values.memo,
    //     leglCode: values.property,
    //     leglDesc: propertyList.find((item) => item.leglCode === values.property).leglDesc,
    //     outAccountAmount: mode === 1 ? balance.twd : balance.frgn,
    //   };

    //   history.push('/E001001', { ...confirmData });
    // } else {
    //   await showInfo(response.message);
    // }
  };

  /**
   * 取得指定轉帳類型的帳號清單。
   * @param {*} type 轉帳類型：0.轉出清單, 1.轉入清單
   */
  const getAccountList = (type) => {
    const isNTD = (viewModel.mode === 1 && type === 0) || (viewModel.mode === 2 && type === 1);
    const accts = (isNTD ? viewModel.ntdAccounts : viewModel.frgnAccount);
    return accts.map((acct) => ({ label: acct.accountNo, value: acct.accountNo, data: acct }));
  };

  /**
   * 取得幣別清單。
   */
  const getCurrencyList = () => (viewModel.currencies ?? [])
    .filter((item) => {
      if (viewModel.mode === 1) return true; // 台轉外：列出本行所有可以兌換的幣別
      return viewModel.frgnAccount[0].details
        .find((detail) => detail.currency === item.Currency && detail.balance > 0); // 外轉台：只列出用戶帳戶中有餘額的幣別
    })
    .map((item) => ({
      label: `${item.CurrencyName} ${item.Currency}`,
      value: item.Currency,
    }));

  /**
   * 取得目前換匯類型的交易性質清單
   */
  const getPropertyList = () => {
    let properties = viewModel.properties[viewModel.mode];
    if (!properties) {
      viewModel.properties[viewModel.mode] = [];
      const api = getExchangePropertyList({ trnsType: viewModel.mode, action: '1' }).then((props) => props);
      Promise.all([api]).then((values) => {
        const [props] = values;
        viewModel.properties[viewModel.mode] = props;
        properties = props;
      });
    }
    return properties?.map((prop) => ({ label: prop.leglDesc, value: prop.leglCode })) ?? []; // TODO key: item.leglCode,
  };

  /**
   * 取得指定轉帳類型的帳戶餘額。
   * @param {*} type 轉帳類型：0.轉出清單, 1.轉入清單
   */
  const getBalance = (type) => {
    let balance = '-';
    let ccy = '';
    const acct = (type === 0) ? viewModel.outAccount : viewModel.inAccount;
    if (acct) {
      if (acct.acctType === 'F') {
        ccy = currency;
        if (currency) {
          balance = acct.details.find((detail) => detail.currency === currency)?.balance ?? 0;
        } else {
          balance = '(尚未選擇換匯幣別)';
        }
      } else {
        ccy = 'NTD';
        balance = acct.details[0].balance;
      }
    }
    return { ccy, balance };
  };

  /**
   * 顯示指定轉帳類型的帳戶餘額。
   * @param {*} type 轉帳類型：0.轉出清單, 1.轉入清單
   */
  const renderBalance = (type) => {
    const {ccy, balance} = getBalance(type);
    return (
      <FEIBHintMessage className="balance">
        {`可用餘額 ${ccy} ${toCurrency(balance)}`}
      </FEIBHintMessage>
    );
  };

  /**
   * 預估可兌換的轉入幣別金額。
   */
  const renderEstimate = () => {
    // const type = (viewModel.mode === 1) ? 1 : 0;
    const {balance} = getBalance(0); // 取出轉出帳戶的餘額。
    const ccyInfo = viewModel.currencies.find((item) => item.Currency === currency);
    if (ccyInfo) {
      viewModel.currency = ccyInfo; // 順便記下目前選取幣別的詳細資訊。
      let prompt;
      if (viewModel.mode === 1) {
        viewModel.maxExchange = Math.round(balance / ccyInfo.SpotAskRate);
        prompt = `預估最多可兌換 ${toCurrency(viewModel.maxExchange)}${ccyInfo.CurrencyName}`;
      } else {
        viewModel.maxExchange = Math.round(balance * ccyInfo.SpotBidRate);
        prompt = `預估最多可換回 新台幣 ${toCurrency(viewModel.maxExchange)}元`;
      }
      return (
        <FEIBHintMessage className="balance">
          {prompt}
          <br />
          <div style={{ textAlign: 'right' }}>(實際金額以交易結果為準)</div>
        </FEIBHintMessage>
      );
    }
    return <div />;
  };

  /**
   * 顯示匯率看版
   */
  const onExchangeRateButtonClick = async () => {
    if (!viewModel.exRateBoard) {
      viewModel.exRateBoard = await getExchangeRateInfo({});
    }

    showCustomPrompt({
      title: '匯率',
      message: <E00100Table exchangeRate={viewModel.exRateBoard} />,
    });
  };

  // console.log('Render', getValues(), viewModel);
  /**
   * 主頁面輸出
   */
  return (
    <Layout fid={Func.E001} title="外幣換匯">
      <ExchangeWrapper>
        <div className="borderBtnContainer">
          <FEIBBorderButton type="button" onClick={onExchangeRateButtonClick}>
            外匯匯率查詢
          </FEIBBorderButton>
        </div>

        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <section>
            <Controller control={control} name="mode"
              render={({ field }) => (
                <RadioGroup {...field} row name="mode" onChange={(e) => onModeChanged(parseInt(e.target.value, 10))}>
                  <FEIBRadioLabel value={1} control={<FEIBRadio />} label="新臺幣轉外幣" className="customWidth" />
                  <FEIBRadioLabel value={2} control={<FEIBRadio />} label="外幣轉新臺幣" />
                </RadioGroup>
              )}
            />
          </section>

          <section>
            <DropdownField name="outAccount" control={control} labelName="轉出帳號" options={getAccountList(0)} />
            {renderBalance(0)}
          </section>

          <section>
            <DropdownField name="currency" control={control} labelName="換匯幣別" options={getCurrencyList()} />
            {renderEstimate()}
          </section>

          <section>
            <DropdownField name="inAccount" control={control} labelName="轉入帳號" options={getAccountList(1)} />
            {renderBalance(1)}
          </section>

          {viewModel.currency && (
          <section className="exchangeAmount">
            <CurrencyInputField
              labelName="兌換金額"
              placeholder="請輸入兌換金額"
              name="exchangeAmount"
              control={control}
              inputProps={{ inputMode: 'numeric' }}
            />
            <Controller control={control} name="outType"
              render={({ field }) => (
                <RadioGroup {...field} row name="outType" onChange={(e) => setValue('outType', parseInt(e.target.value, 10))}>
                  <FEIBRadioLabel value={1} control={<FEIBRadio />} className="customWidth"
                    label={viewModel.currency.CurrencyName}
                  />
                  <FEIBRadioLabel value={2} control={<FEIBRadio />}
                    label="新臺幣"
                  />
                </RadioGroup>
              )}
            />
            {/* <RadioGroupField name="outType" control={control}
              options={[
                {
                  value: '1',
                  label: (
                    <CurrencyInputField
                      labelName={`希望${viewModel.mode === 2 ? '轉出' : '轉入'}${viewModel.currency?.CurrencyName || ''}`}
                      placeholder={`請輸入${viewModel.mode === 2 ? '轉出' : '轉入'}金額`}
                      name="foreignBalance"
                      control={control}
                        // symbol={getCurrenyInfo(currency)?.symbol}
                      inputProps={{
                        // disabled: outType === '2',
                        inputMode: 'numeric',
                      }}
                    />
                  ),
                },
                {
                  value: '2',
                  label: (
                    <CurrencyInputField
                      labelName={`希望${viewModel.mode === 2 ? '轉入' : '轉出'}新臺幣`}
                      placeholder={`請輸入${viewModel.mode === 2 ? '轉入' : '轉出'}金額`}
                      name="ntDollorBalance"
                      control={control}
                      inputProps={{
                        // disabled: outType === '1',
                        inputMode: 'numeric',
                      }}
                    />
                  ),
                },
              ]}
            /> */}
          </section>
          )}

          <section>
            <DropdownField name="property" control={control} labelName="匯款性質" defaultValues="" options={getPropertyList()} />
          </section>

          <section>
            <TextInputField labelName="備註" name="memo" control={control} placeholder="請輸入備註" inputProps={{ maxLength: 20 }} />
          </section>

          <Accordion title="外幣換匯規範" style={{ marginBottom: '1.5rem' }}>
            <p>
              以本行牌告匯率或網銀優惠匯率為成交匯率(預約交易係依據交易日上午09:30最近一盤牌告/網銀優惠匯率為成交匯率)。營業時間以外辦理外匯交易結匯金額併入次營業日累積結匯金額；為網銀優惠將視市場波動清況，適時暫時取消優惠。
            </p>
          </Accordion>

          <Accordion style={{ marginBottom: '0.5rem' }}>
            <E00100Notice />
          </Accordion>

          {viewModel.isBanker && (
            <InfoArea style={{ marginTop: '1rem' }}>換匯匯率將依據本行員工優惠匯率進行交易</InfoArea>
          )}

          <div className="submitBtn">
            <FEIBButton type="submit">同意條款並確認</FEIBButton>
          </div>
        </form>
      </ExchangeWrapper>
    </Layout>
  );
};

export default E00100;
