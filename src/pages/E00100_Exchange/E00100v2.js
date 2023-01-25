import { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router';
import {
  isEmployee,
  getCcyList,
  getExchangePropertyList,
  getExchangeRateInfo,
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
    handleSubmit, control, watch, reset,
  } = useForm({
    defaultValues: {
      exchangeType: '',
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

  const [banker, setBanker] = useState(false);
  const [accountsList, setAccountsList] = useState([]);
  const [currencyTypeList, setCurrencyTypeList] = useState([]);
  const [propertyList, setPropertyList] = useState({});

  const {
    currency, exchangeType, inAccount, outAccount, outType, ntDollorBalance, foreignBalance, property,
  } = watch();

  const selectedCurrency = useMemo(() => {
    if (!currencyTypeList.length || !currency) return {};
    return currencyTypeList.find((item) => item?.Currency === currency);
  }, [currency, currencyTypeList]);

  // 查詢是否為行員
  const getIsEmployee = async () => {
    const isBanker = await isEmployee();
    if (isBanker) setBanker(isBanker);
  };

  // 取得可交易幣別清單
  const fetchCcyList = async () => {
    const response = await getCcyList(); // 回傳的資料的 key 不是 camelCase
    if (response?.length) setCurrencyTypeList(response);
    return response[0].Currency;
  };

  // 臺幣/外幣帳戶餘額
  const balance = useMemo(() => {
    const isTWD2Frgn = exchangeType === '1';
    const twdAccount = accountsList.find(({account}) => account === (isTWD2Frgn ? outAccount : inAccount));
    const twdBalance = twdAccount?.details.find((detail) => detail.currency === 'TWD');
    const frgnAccount = accountsList.find(({account}) => account === (isTWD2Frgn ? inAccount : outAccount));
    const frgnBalance = frgnAccount?.details.find((detail) => detail.currency === currency);
    return { twd: twdBalance?.balance ?? 0, frgn: frgnBalance?.balance ?? 0 };
  }, [currency, accountsList, inAccount, outAccount, exchangeType]);

  // 檢查是否超出餘額
  const checkOverAmt = (data) => {
    const amt = Number(data);
    // 判斷是 1. 外幣視角 or 2.新臺幣視角
    const frgn2Ntd = outType === '2';
    // 如果是臺幣轉外幣，檢查是否超過臺幣帳戶的餘額
    // TODO 待確認 SpotAskRate 與  SpotBidRate 是否正確
    if (exchangeType === '1') {
      return frgn2Ntd ? amt > balance.twd : amt > balance.twd / selectedCurrency.SpotAskRate;
    }
    // 如果是外幣轉臺幣，檢查是否超過外幣帳戶的餘額
    if (exchangeType === '2') {
      return frgn2Ntd ? amt / selectedCurrency.SpotBidRate > balance.frgn : amt > balance.frgn;
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
        isEmployee: banker, // TODO 由 Conotroller 從 token 中取出。
      };

      const confirmData = {
        ...model,
        ...response,
        memo: values.memo,
        leglCode: values.property,
        leglDesc: propertyList.find((item) => item.leglCode === values.property).leglDesc,
        outAccountAmount: exchangeType === '1' ? balance.twd : balance.frgn,
      };

      history.push('/E001001', { ...confirmData });
    } else {
      await showInfo(response.message);
    }
  };

  const generateAvailibleAmount = () => {
    if (exchangeType === '1') {
      return toCurrency(Math.round(balance.twd / selectedCurrency.SpotAskRate));
    }
    return toCurrency(Math.round(balance.frgn * selectedCurrency.SpotBidRate));
  };

  // 轉出/轉入的帳號選項
  const accountOptions = useMemo(() => {
    const generateOpts = (arr) => arr.map((item) => ({ label: item.account, value: item.account }));
    // 先判斷目前是 臺幣轉外幣 或是 外幣轉臺幣
    const isNtd2Frgn = exchangeType === '1';
    // 若為臺幣轉外幣，轉出帳號必須是臺幣帳戶，反之則為外幣帳戶
    const outAcctList = accountsList.filter(({ details }) => {
      if (!details) return false;
      return details.find((item) => (isNtd2Frgn ? item.currency === 'TWD' : item.currency !== 'TWD'));
    });
    // 若為臺幣轉外幣，轉入帳號必須是外幣帳戶，反之則為臺幣帳戶
    const inAcctList = accountsList.filter(({ details }) => {
      if (!details) return false;
      return details.find((item) => (!isNtd2Frgn ? item.currency === 'TWD' : item.currency !== 'TWD'));
    });

    return {
      outOptions: generateOpts(outAcctList),
      inOptions: generateOpts(inAcctList),
    };
  }, [accountsList.length, exchangeType]);

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
  const renderBalance = (type) => {
    let isNTD;
    if (type === 'transOut') isNTD = exchangeType === '1';
    else if (type === 'transIn') isNTD = exchangeType === '2';
    return (
      <FEIBHintMessage className="balance">
        可用餘額
        &nbsp;
        {isNTD ? 'NTD' : currency}
        &nbsp;
        {toCurrency(balance[isNTD ? 'twd' : 'frgn'])}
      </FEIBHintMessage>
    );
  };

  useEffect(async () => {
    // 取得交易性質列表
    dispatch(setWaittingVisible(true));
    let propList;
    if (!propertyList[exchangeType]) {
      propList = await getExchangePropertyList({ trnsType: exchangeType, action: '1' });
      setPropertyList((prevList) => ({ ...prevList, [exchangeType]: propList }));
    } else propList = propertyList[exchangeType];

    if (!accountsList.length) {
      // 確認使用者是否為行員
      getIsEmployee();
      // 取得幣別列表，並拿取預設幣別
      const defaultCurrency = await fetchCcyList();
      // 取得帳戶列表，並篩選出有約定的帳戶
      const accountListRes = await getAccountsList('MSF');
      //  TODO 依文件說明，先不用過濾 transable ，直接跳出 modal 提示使用者該帳號沒有設定約定才對
      const availableAccts = accountListRes.filter(({ transable }) => !!transable);
      setAccountsList(availableAccts);

      reset((formValues) => ({
        ...formValues,
        property: propList[0].leglCode,
        currency: defaultCurrency,
        outAccount: availableAccts[0]?.account ?? '', // BUG  第一個可能不一定是臺幣帳戶
      }));
    }
    dispatch(setWaittingVisible(false));
    // exchangeType 改變時，轉出/轉入帳號 ＆ 匯款性質欄位需要變更
    if (property && !propertyOptions.find((opt) => opt.value === property)) {
      reset((formValues) => ({
        ...formValues,
        inAccount: '',
        property: propList[0].leglCode,
        outAccount: accountOptions.outOptions[0].value,
      }));
    }
    // outType 改變時，清空 foreignBalance 以及 ntDollorBalance 欄位
    if (outType === '1' && ntDollorBalance) reset((formValues) => ({...formValues, ntDollorBalance: ''}));
    if (outType === '2' && foreignBalance) reset((formValues) => ({ ...formValues, foreignBalance: '' }));
  }, [exchangeType, outType]);

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
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          style={{ gap: '2rem' }}
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
              options={accountOptions.outOptions}
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
              options={accountOptions.inOptions}
            />
            {renderBalance('transIn')}
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
            <E00100Rules />
          </Accordion>
          <Accordion>
            <E00100Notice />
          </Accordion>
          {banker && (
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
