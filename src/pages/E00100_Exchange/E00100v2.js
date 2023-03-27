/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/jsx-max-props-per-line */
import { useState, useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { RadioGroup } from '@material-ui/core';

import { Func } from 'utilities/FuncID';
import { getAccountsList } from 'utilities/CacheData';
import { toCurrency } from 'utilities/Generator';
import { showCustomPrompt } from 'utilities/MessageModal';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import {
  isEmployee,
  getCcyList,
  getExchangePropertyList,
  getExchangeRateInfo,
} from 'pages/E00100_Exchange/api';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBBorderButton, FEIBButton, FEIBHintMessage, FEIBInputLabel, FEIBRadio, FEIBRadioLabel,
} from 'components/elements';
import { CurrencyInputField, DropdownField, TextInputField } from 'components/Fields';
import Accordion from 'components/Accordion';
import InfoArea from 'components/InfoArea';

import { loadFuncParams } from 'hooks/useNavigation';
import { E00100Notice, E00100Table } from './E00100_Content';

/* Styles */
import { ExchangeWrapper } from './E00100.style';

/**
 * E00100 外幣換匯首頁
 * @param {{location: {state: {viewModel, model}}}} props
 */
const E00100 = (props) => {
  const { location } = props;
  const { state } = location;

  const history = useHistory();
  const dispatch = useDispatch();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [viewModel, setViewModel] = useState({
    mode: 1,
    isBanker: false,
    ntdAccounts: [], // 台幣帳戶清單
    frgnAccount: [], // 外幣帳戶
    currencies: [], // BUG {1: [台幣可兌換的外幣]}, {2: [餘額非零的外幣帳戶幣別]}
    properties: {}, // {1: [台幣匯款性質]}, {2: [外幣匯款性質]}
    inAccount: null,
    // inAmount: null, // 估算兌換指定轉入金額所需的轉入金額, 由確認頁 create API 計算後傳回。
    outAccount: null,
    // outAmount: null, // 估算兌換指定轉入金額所需的轉出金額, 由確認頁 create API 計算後傳回。
    currency: null,
    exRateBoard: null, // 匯率看版
  });

  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    outAccount: yup.string().required('請選擇轉出帳號'),
    currency: yup.string().required('請選擇換匯幣別'),
    inAccount: yup.string().required('請選擇轉入帳號'),
    property: yup.string().required('請選擇匯款性質'),
    amount: yup.number().required('請輸入金額').typeError('請輸入金額'),
  });
  const {
    handleSubmit, control, watch, reset, getValues, setValue, setError, clearErrors, // formState: { errors },
  } = useForm({
    defaultValues: {
      mode: 0, // 0.尚未初始化, 1.新臺幣轉外幣, 2.外幣轉新臺幣
      outAccount: '', // 轉出帳號
      currency: '', // 兌換使用的幣別(mode => 1.轉入幣別, 2.轉出幣別)
      inAccount: '', // 轉入帳號
      amount: '', // 兌換金額
      amountType: 1, // 兌換金額的幣別模式(1.依轉出幣別, 2.依轉入幣別)
      property: '', // 性質別
      memo: '', // 備註
    },
    resolver: yupResolver(schema),
    reValidateMode: 'onBlur',
  });

  const {
    inAccount, outAccount, currency, amount, amountType,
  } = watch();

  /**
   * 初始化
   */
  useEffect(() => {
    if (viewModel.loaded) return;

    dispatch(setWaittingVisible(true));

    // 從確認頁返回。
    if (state && state.viewModel) {
      setViewModel(state.viewModel);
      reset(state.model);
      dispatch(setWaittingVisible(false));
      return;
    }

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
    });

    // 取得幣別列表(很慢，所以不等這支)
    getCcyList().then((ccys) => { // 回傳的資料的 key 不是 camelCase
      viewModel.currencies = ccys?.length ? ccys : [];
      forceUpdate();
      dispatch(setWaittingVisible(false));
    });

    let params;
    const appJs = loadFuncParams().then((appRs) => { params = appRs; });

    Promise.all([api1, api2, appJs]).then(() => {
      viewModel.loaded = true; // 避免重複載入資料

      console.log(params, state);
      const data = (params ?? state)?.model ?? { // 若有
        mode: 1,
        // outAccount: viewModel.outAccount.accountNo,
        // inAccount: viewModel.inAccount.accountNo,
        // currency: '', // 沒有預設的必要
        // property: '', // 沒有預設的必要
        amountType: 1,
      };
      onModeChanged(data.mode);
      reset((formValues) => ({...formValues, ...data}));
    }).finally(() => dispatch(setWaittingVisible(false)));
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
   * 變更換匯模式（1.新臺幣轉外幣, 2.外幣轉新臺幣）
   * @param {*} newMode 新的換匯模式
   */
  const onModeChanged = (newMode) => {
    // const values = getValues();
    viewModel.mode = newMode;
    viewModel.outAccount = (getAccountList(0).length > 0) ? getAccountList(0)[0].data : '';
    viewModel.inAccount = (getAccountList(1).length > 0) ? getAccountList(1)[0].data : '';

    // 載入交易性質清單
    const properties = viewModel.properties[newMode];
    if (!properties || !properties.length) {
      getExchangePropertyList({ trnsType: viewModel.mode, action: '1' }).then((items) => {
        viewModel.properties[viewModel.mode] = items;
        setValue('property', '*');
      });
    }

    //
    reset((formValues) => ({
      ...formValues,
      mode: newMode,
      outAccount: '',
      inAccount: '',
      property: '',
    }));
  };

  useEffect(() => {
    if (outAccount === '' && viewModel.outAccount) {
      setValue('outAccount', viewModel.outAccount.accountNo);
    } else {
      viewModel.outAccount = getAccountList(0).find((item) => item.data.accountNo === outAccount)?.data;
    }
  }, [outAccount, viewModel.outAccount]);

  useEffect(() => {
    // TODO 轉入帳號必需是轉出帳號的約定帳號
    //      時有同ID互轉，是否就不用檢查了？
    if (inAccount === '' && viewModel.inAccount) {
      setValue('inAccount', viewModel.inAccount.accountNo);
    } else {
      viewModel.inAccount = getAccountList(1).find((item) => item.data.accountNo === inAccount)?.data;
    }
  }, [inAccount, viewModel.inAccount]);

  /**
   * 檢查是否超出餘額
   */
  useEffect(() => {
    let maxAmount;
    if (amountType === 1) { // 兌換金額的幣別模式(1.依轉出幣別, 2.依轉入幣別)
      const {balance} = getBalance(1); // 取出轉出帳戶的餘額。
      maxAmount = balance;
    } else {
      maxAmount = viewModel.maxExchange;
    }
    if (amount > maxAmount) {
      setError('amount', { type: 'custom', message: '金額已超過轉出帳號的餘額' });
    } else clearErrors('amount');
  }, [amount, amountType]);

  /**
   * 進入換匯確認頁。
   * @param {*} values 使用者輸入的資料。
   */
  const onSubmit = async (values) => {
    history.push('/E001001', {
      model: values,
      viewModel, // NOTE 會由 create API 估算兌換指定轉入金額所需的轉出金額 寫入 outAmount
    });
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
    const properties = viewModel.properties[viewModel.mode];
    const items = properties?.map((prop) => ({ label: prop.leglDesc, value: prop.leglCode })) ?? []; // TODO key: item.leglCode,
    return [
      { label: '請選擇匯款性質', value: '*', disabledOption: true },
      ...items,
    ];
  };

  /**
   * 取得指定轉帳類型的帳戶餘額。
   * @param {*} type 轉帳類型：1.轉出帳號, 2.轉入帳號
   */
  const getBalance = (type) => {
    let balance = '-';
    let ccy = '';
    const acct = (type === 1) ? viewModel.outAccount : viewModel.inAccount;
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
   * @param {*} type 轉帳類型：1.轉出帳號, 2.轉入帳號
   */
  const renderBalance = (type) => {
    const {ccy, balance} = getBalance(type);
    return (
      <FEIBHintMessage>
        {`可用餘額 ${ccy} ${toCurrency(balance)}`}
      </FEIBHintMessage>
    );
  };

  /**
   * 預估可兌換的轉入幣別及金額。
   * @param {Number} amt 要估算的兌換金額。
   * @param {Number} mode amt的幣別類型：1.台幣金額, 2.外幣金額
   * @returns {{ quota: Number, ccyInfo: { Currency: String, CurrencyName: String } }} {
   *   quota: ,
   *   ccyInfo: ,
   * }
   */
  const estimateExchangeInfo = (amt, mode) => {
    // console.log(amt, mode);
    const ccyInfo = viewModel.currencies.find((item) => item.Currency === currency);
    if (ccyInfo) {
      let quota;
      if (mode === 1) {
        quota = Number((amt / ccyInfo.SpotAskRate).toFixed(2));
      } else {
        quota = Number((amt * ccyInfo.SpotBidRate).toFixed(2));
      }
      return { quota, ccyInfo };
    }
    return null;
  };

  /**
   * 顯示預估可兌換的轉入幣別及金額。
   */
  const renderEstimate = () => {
    const {balance} = getBalance(1);
    const excnageInfo = estimateExchangeInfo(balance, viewModel.mode);
    if (excnageInfo) {
      const { quota, ccyInfo } = excnageInfo;
      viewModel.currency = ccyInfo; // 順便記下目前選取幣別的詳細資訊。
      viewModel.maxExchange = quota;
      // NOTE 保留日後可從優利取得剩餘額度資料時，再顯示。
      // let prompt;
      // if (viewModel.mode === 1) {
      //   prompt = `預估可兌換 ${toCurrency(viewModel.maxExchange)}${ccyInfo.CurrencyName}`;
      // } else {
      //   prompt = `預估可換回 新台幣 ${toCurrency(viewModel.maxExchange)}元`;
      // }
      // return (
      //   <FEIBHintMessage>
      //     {prompt}
      //     <br />
      //     <div style={{ textAlign: 'right' }}>(實際金額以交易結果為準)</div>
      //   </FEIBHintMessage>
      // );
    }
    return <div />;
  };

  /**
   *
   * @param {Number} amt 要估算的兌換金額；未指定金額時，以轉出帳戶的餘額計算。
   * @param {Number} isNTD 兌換計算幣別。
   */
  const renderEstimateNeed = (amt, isNTD) => {
    if (!amt) return null;

    const mode = (isNTD ? 1 : 2);

    const excnageInfo = estimateExchangeInfo(amt, mode);
    if (excnageInfo) {
      const { quota, ccyInfo } = excnageInfo;
      let prompt;
      if (mode === 1) {
        prompt = `預估可兌換 ${toCurrency(quota, 2, true)}${ccyInfo.CurrencyName}`;
      } else {
        prompt = `預估需 新台幣 ${toCurrency(quota)}元`;
      }
      return (
        <FEIBHintMessage>
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
    // 匯率需為即時資訊。
    viewModel.exRateBoard = await getExchangeRateInfo({});

    showCustomPrompt({
      title: '匯率',
      message: <E00100Table exchangeRate={viewModel.exRateBoard} />,
    });
  };

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
            {renderBalance(1)}
          </section>

          <section>
            <DropdownField name="currency" control={control} labelName="換匯幣別" options={getCurrencyList()} />
            {renderEstimate()}
          </section>

          <section>
            <DropdownField name="inAccount" control={control} labelName="轉入帳號" options={getAccountList(1)} />
            {renderBalance(2)}
          </section>

          {viewModel.currency && (
          <section>
            <div className="amount">
              <Controller control={control} name="amountType"
                render={({ field }) => (
                  <>
                    <FEIBInputLabel>兌換金額</FEIBInputLabel>
                    <RadioGroup {...field} style={{alignItems: 'center'}} row name="amountType" onChange={(e) => setValue('amountType', parseInt(e.target.value, 10))}>
                      <FEIBRadioLabel value={1} control={<FEIBRadio />} label={viewModel.currency.CurrencyName} />
                      <FEIBRadioLabel value={2} control={<FEIBRadio />} label="新臺幣" />
                    </RadioGroup>
                  </>
                )}
              />
              <CurrencyInputField
                placeholder="請輸入兌換金額"
                name="amount"
                control={control}
                currency={amountType === 2 ? 'NTD' : currency}
                inputProps={{ inputMode: 'numeric' }}
              />
            </div>
            {renderEstimateNeed(amount, (amountType === viewModel.mode))}
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
