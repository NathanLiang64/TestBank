import { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router';
import {
  isEmployee,
  getCcyList,
  getExchangePropertyList,
  getExchangeRateInfo,
  getAgreedAccount,
  getAccountsList,
} from 'pages/E00100_Exchange/api';

/* Elements */
import { FEIBBorderButton, FEIBButton, FEIBHintMessage} from 'components/elements';
import Layout from 'components/Layout/Layout';
import { useForm } from 'react-hook-form';
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
// import { getAccountsList } from 'utilities/CacheData';
import { E00100Notice, E00100Table } from './E00100_Content';

/* Styles */
import { ExchangeWrapper } from './E00100.style';

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
    exchangeType: yup.string().required('請選擇換匯種類'),
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
    handleSubmit, control, watch, reset, setValue,
  } = useForm({
    defaultValues: {
      exchangeType: '1',
      outType: '1',
      foreignBalance: '',
      ntDollorBalance: '',
      property: '',
      currency: '',
      outAccount: '',
      inAccount: '',
      memo: '',
    },
    resolver: yupResolver(schema),
    reValidateMode: 'onBlur',
  });

  const [banker, setBanker] = useState();
  const [currencyTypeList, setCurrencyTypeList] = useState([]);
  const [propertyList, setPropertyList] = useState({});
  const [exchangeRate, setExchangeRate] = useState([]);
  const [accountsListObj, setAccountsListObj] = useState({});

  const {
    currency, exchangeType, outAccount, outType, ntDollorBalance, foreignBalance,
  } = watch();

  const selectedCurrency = useMemo(() => {
    if (!currencyTypeList.length || !currency) return {};
    return currencyTypeList.find((item) => item?.Currency === currency);
  }, [currency, currencyTypeList]);

  // 查詢是否為行員
  const getIsEmployee = async () => {
    if (banker) {
      const employee = await isEmployee();
      setBanker(employee);
    }
  };

  // 取得可交易幣別清單
  const fetchCcyList = async () => {
    if (currencyTypeList.length) return;
    const currencyList = await getCcyList(); // 回傳的資料的 key 不是 camelCase
    setCurrencyTypeList(currencyList);
    setValue('currency', currencyList[0]?.Currency);
  };

  // 臺幣/外幣帳戶餘額
  const balance = useMemo(() => {
    if (accountsListObj[outAccount]) {
      const {details} = accountsListObj[outAccount];
      if (exchangeType === '1') {
        const foundDetail = details.find((detail) => detail.currency === 'TWD' || detail.currency === 'NTD');
        return foundDetail?.balance ?? 0;
      }
      const foundDetail = details.find((detail) => detail.currency === currency);
      return foundDetail?.balance ?? 0;
    } return 0;
  }, [currency, outAccount, exchangeType, accountsListObj]);

  // 檢查是否超出餘額
  const checkOverAmt = (data) => {
    const amt = Number(data);
    // 判斷是 1. 外幣視角 or 2.新臺幣視角
    const frgn2Ntd = outType === '2';
    // 如果是臺幣轉外幣，檢查是否超過臺幣帳戶的餘額
    // TODO 待確認 SpotAskRate 與  SpotBidRate 是否正確
    if (exchangeType === '1') {
      return frgn2Ntd ? amt > balance : amt > balance / selectedCurrency.SpotAskRate;
    }
    // 如果是外幣轉臺幣，檢查是否超過外幣帳戶的餘額
    if (exchangeType === '2') {
      return frgn2Ntd ? amt / selectedCurrency.SpotBidRate > balance : amt > balance;
    }
    return true;
  };

  // 取得換匯資訊與密文
  const onSubmit = async (values) => {
    const trfAmt = values.outType === '1' ? values.foreignBalance : values.ntDollorBalance;
    const checkOverResult = checkOverAmt(trfAmt);
    if (checkOverResult) {
      await showInfo('您輸入的金額已超過轉出帳號的餘額');
      return;
    }

    dispatch(setWaittingVisible(true));
    const response = await getExchangeRateInfo(); // BUG 這是取匯率清單，並不是取得換匯掛號的傳回資訊！
    dispatch(setWaittingVisible(false));

    if (!response.message) {
      const model = {
        trnsType: values.exchangeType,
        outAcct: values.outAccount,
        inAcct: values.inAccount,
        ccyCd: values.currency,
        trfCcyCd: values.outType === '1' ? values.currency : 'NTD',
        trfAmt, // 目前是帶字串過去，是否應該帶數字?
        isEmployee: banker.isEmployee, // TODO 由 Conotroller 從 token 中取出。
      };

      const confirmData = {
        ...model,
        ...response,
        memo: values.memo,
        leglCode: values.property,
        leglDesc: propertyList.find((item) => item.leglCode === values.property).leglDesc, // TODO 還需要給嗎?
        outAccountAmount: balance, // TODO 待測試
      };

      history.push('/E001001', { ...confirmData });
    } else {
      await showInfo(response.message);
    }
  };

  const generateAvailibleAmount = () => {
    if (exchangeType === '1') {
      return toCurrency(Math.round(balance / selectedCurrency.SpotAskRate));
    }
    return toCurrency(Math.round(balance * selectedCurrency.SpotBidRate));
  };

  // 轉出/轉入的帳號選項
  const outAccountOptions = useMemo(() => {
    const allowedOutOptions = Object.keys(accountsListObj).filter((accountNo) => (accountsListObj[accountNo].acctType === 'F' ? exchangeType === '2' : exchangeType === '1'));
    const newOutOptions = allowedOutOptions.map((accountNo) => ({label: accountNo, value: accountNo}));
    return newOutOptions;
  }, [exchangeType, accountsListObj]);

  // 幣別選項
  const currencyTypeOptions = useMemo(
    () => currencyTypeList.map((item) => ({
      label: `${item.CurrencyName} ${item.Currency}`,
      value: item.Currency,
    })),
    [currencyTypeList],
  );

  // 匯款性質選項
  const propertyOptions = useMemo(() => {
    if (!propertyList[exchangeType]) return [];
    return propertyList[exchangeType].map((item) => ({
      key: item.leglCode,
      label: item.leglDesc,
      value: item.leglCode,
    }));
  }, [exchangeType, propertyList]);

  // 餘額顯示，type = 要顯示轉出或轉入帳號
  const renderBalance = () => {
    const isNTD = exchangeType === '1';
    return (
      <FEIBHintMessage className="balance">
        可用餘額
        &nbsp;
        {isNTD ? 'NTD' : currency}
        &nbsp;
        {toCurrency(balance)}
      </FEIBHintMessage>
    );
  };

  const onExchangeRateButtonClick = async () => {
    let rate = [];

    if (!exchangeRate.length) {
      rate = await getExchangeRateInfo({});
      setExchangeRate(rate);
    } else rate = exchangeRate;

    showCustomPrompt({
      title: '匯率',
      message: <E00100Table exchangeRate={rate} />,
      okContent: '確定',
    });
  };

  const fetchPropertyList = async (type) => {
    let propList;
    if (!propertyList[type]) {
      propList = await getExchangePropertyList({ trnsType: type, action: '1' });
      setPropertyList((prevList) => ({ ...prevList, [type]: propList }));
    } else propList = propertyList[type];
    setValue('property', propList[0].leglCode);
  };

  useEffect(async () => {
    // 取得交易性質列表
    fetchPropertyList(exchangeType);
    // 確認使用者是否為行員
    getIsEmployee();
    // 取得幣別列表
    fetchCcyList();

    if (!Object.keys(accountsListObj).length) {
      dispatch(setWaittingVisible(true));
      // 取得帳戶列表，並篩選出有約定的帳戶
      const accountListRes = await getAccountsList('MSF'); // TODO 後續透過 cacheReducer 拿取
      const transableAccountList = accountListRes.filter(({transable}) => true || !!transable); // TODO For 測試需求，暫不刪除
      const obj = transableAccountList.reduce((acc, cur) => {
        acc[cur.account] = {...cur, inAccountOptions: null};
        return acc;
      }, {});
      setAccountsListObj(obj);

      // 預設帳號設為非台幣的帳戶
      const defaultAccount = transableAccountList.find(({acctType}) => acctType !== 'F');
      reset((formValues) => ({ ...formValues, outAccount: defaultAccount?.account ?? ''}));
      dispatch(setWaittingVisible(false));
    } else { // TODO 拿到下一個 useEffect 去做
      const [defaultAccount] = Object.keys(accountsListObj).filter((accountNo) => (accountsListObj[accountNo].acctType === 'F' ? exchangeType === '2' : exchangeType === '1'));
      reset((formValues) => ({ ...formValues, outAccount: defaultAccount ?? ''}));
    }
    // else {
    //   reset((formValues) => ({
    //     ...formValues,
    //     inAccount: '',
    //     outAccount: outAccountOptions[0]?.value ?? '',
    //   }));
    // }

    // exchangeType 改變時，轉出帳號需要變更
    // if (property && !propertyOptions.find((opt) => opt.value === property)) {
    //   reset((formValues) => ({
    //     ...formValues,
    //     inAccount: '',
    //     // property: propList[0].leglCode, TODO 待確認
    //     outAccount: outAccountOptions[0]?.value ?? '',
    //   }));
    // }
    // outType 改變時，清空 foreignBalance 以及 ntDollorBalance 欄位
    if (outType === '1' && ntDollorBalance) reset((formValues) => ({...formValues, ntDollorBalance: ''}));
    if (outType === '2' && foreignBalance) reset((formValues) => ({ ...formValues, foreignBalance: '' }));
  }, [exchangeType, outType]);

  // 轉出帳號改變時，動態拿取對應的約定轉出帳號列表
  useEffect(() => {
    if (outAccount && !accountsListObj[outAccount].inAccountOptions) {
      getAgreedAccount(outAccount).then((accts) => {
        // TODO，是否只允許顯示特定科目 001活儲/003行員存款/004活存/031支存
        const allowedAccts = accts.filter((acct) => (acct.isSelf && (exchangeType === '1' ? acct.isForeign : !acct.isForeign)));
        const options = allowedAccts.map((acct) => ({label: acct.acctId, value: acct.acctId}));
        if (!options.length) {
          showCustomPrompt({
            message: '該帳號目前尚未擁有可進行換匯的約定轉帳帳號，請先進行約定本人轉帳帳號後，再進行換匯。',
            onOk: () => window.open('https://eauth.feib.com.tw/AccountAgreement/sameId/index', '_blank'), // ??? 連hardcode 待確認，需要透過 API 拿取???
            okContent: '立即設定',
            onCancel: () => {},
          });
        }

        setAccountsListObj((prevObj) => ({...prevObj, [outAccount]: {...prevObj[outAccount], inAccountOptions: options}}));
      });
    }
  }, [outAccount, exchangeType]);
  console.log('accountsListObj', accountsListObj);
  return (
    <Layout title="外幣換匯">
      <ExchangeWrapper style={{ padding: '2.4rem 1.6rem 2.4rem 1.6rem' }}>
        <div className="borderBtnContainer">
          <FEIBBorderButton
            className="customSize"
            type="button"
            onClick={onExchangeRateButtonClick}
          >
            外匯匯率查詢
          </FEIBBorderButton>
        </div>
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: 'grid',
            alignContent: 'flex-start',
            gridGap: '2rem',
          }}
        >
          <section>
            <RadioGroupField
              row
              labelName="換匯種類"
              name="exchangeType"
              control={control}
              options={[
                { label: '新臺幣轉外幣', value: '1' },
                { label: '外幣轉新臺幣', value: '2' },
              ]}
            />
          </section>
          <section>
            <DropdownField
              name="outAccount"
              control={control}
              labelName="轉出帳號"
              options={outAccountOptions}
            />
            {renderBalance('transOut')}
          </section>
          <section>
            <DropdownField
              name="currency"
              control={control}
              labelName="換匯幣別"
              options={currencyTypeOptions}
            />
            <FEIBHintMessage className="balance">
              預估可換 &nbsp;
              {exchangeType === '1' ? currency : 'NTD'}
              &nbsp;
              {generateAvailibleAmount()}
              &nbsp;(實際金額以交易結果為準)
            </FEIBHintMessage>
          </section>
          <section>
            <DropdownField
              name="inAccount"
              control={control}
              labelName="轉入帳號"
              options={accountsListObj[outAccount]?.inAccountOptions ?? []}
            />
          </section>

          <section>
            <RadioGroupField
              name="outType"
              control={control}
              options={[
                {
                  label: (
                    <>
                      <CurrencyInputField
                        labelName={`希望${
                          exchangeType === '2' ? '轉出' : '轉入'
                        }${selectedCurrency?.CurrencyName || ''}`}
                        placeholder={`請輸入${
                          exchangeType === '2' ? '轉出' : '轉入'
                        }金額`}
                        name="foreignBalance"
                        control={control}
                        symbol={getCurrenyInfo(currency)?.symbol}
                        inputProps={{
                          disabled: outType === '2',
                          inputMode: 'numeric',
                        }}
                      />
                    </>
                  ),
                  value: '1',
                },
                {
                  label: (
                    <>
                      <CurrencyInputField
                        labelName={`希望${
                          exchangeType === '2' ? '轉入' : '轉出'
                        }新臺幣`}
                        placeholder={`請輸入${
                          exchangeType === '2' ? '轉入' : '轉出'
                        }金額`}
                        name="ntDollorBalance"
                        control={control}
                        inputProps={{
                          disabled: outType === '1',
                          inputMode: 'numeric',
                        }}
                      />
                    </>
                  ),
                  value: '2',
                },
              ]}
            />
          </section>
          <section>
            <DropdownField
              name="property"
              control={control}
              labelName="匯款性質"
              defaultValues=""
              options={propertyOptions}
            />
          </section>

          <section>
            <TextInputField
              labelName="備註"
              name="memo"
              control={control}
              placeholder="請輸入備註"
              inputProps={{ maxLength: 20 }}
            />
          </section>
          <Accordion title="外幣換匯規範">
            <p>
              以本行牌告匯率或網銀優惠匯率為成交匯率(預約交易係依據交易日上午09:30最近一盤牌告/網銀優惠匯率為成交匯率)。營業時間以外辦理外匯交易結匯金額併入次營業日累積結匯金額；為網銀優惠將視市場波動清況，適時暫時取消優惠。
            </p>
          </Accordion>
          <Accordion>
            <E00100Notice />
          </Accordion>
          {banker?.isEmployee && (
            <InfoArea>換匯匯率將依據本行員工優惠匯率進行交易</InfoArea>
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
