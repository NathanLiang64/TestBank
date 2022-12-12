import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { numberToChinese, currencySymbolGenerator } from 'utilities/Generator';
import { transferAmountValidation } from 'utilities/validation';
import { customPopup } from 'utilities/MessageModal';
import { getAccountsList, getAgreedAccounts, getExchangePropertyList } from 'pages/D00700_ForeignCurrencyTransfer/api';
import { closeFunc } from 'utilities/AppScriptProxy';
/* Elements */
import Accordion from 'components/Accordion';
import DebitCard from 'components/DebitCard/DebitCard';
import {
  FEIBSelect, FEIBOption, FEIBInput, FEIBInputLabel, FEIBButton, FEIBErrorMessage,
} from 'components/elements';
import Layout from 'components/Layout/Layout';
import NoteContent from 'pages/D00700_ForeignCurrencyTransfer/noteContent';

/* Styles */
import ForeignCurrencyTransferWrapper from './foreignCurrencyTransfer.style';

/* Swiper modules */
SwiperCore.use([Pagination]);

const ForeignCurrencyTransfer = () => {
  const history = useHistory();
  // 交易性質清單
  const [transTypeOptions, setTransTypeOptions] = useState([]);
  // 已選的帳號選單
  const [currentAccount, setCurrentAccount] = useState({});
  // 帳號清單
  const [accountsList, setAccountsList] = useState([]);
  const [mixBalanceStr, setMixBalanceStr] = useState('');
  // 帳戶清單選項
  const [accountListOption, setAccountListOption] = useState();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    account: yup
      .string()
      .required('請選擇轉入帳號'),
    balance: transferAmountValidation(currentAccount.balance),
    transferType: yup
      .string()
      .required('請選擇匯款性質'),
  });
  const {
    handleSubmit, control, formState: { errors }, setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 取得帳戶清單
  const getForeignCurrencyAccounts = async () => {
    const accounts = await getAccountsList('F');
    console.log(accounts);
    if (Array.isArray(accounts)) {
      if (accounts?.length) {
        const formatAccounts = accounts.map((acc) => acc.details.map((detail) => (
          {
            ...detail,
            account: acc.account,
            name: acc.name,
            agreedAccts: null, // NOTE 只有在第一次取約轉帳號時，才會透過API取得清單。
          }
        ))).flat();
        console.log('帳戶清單', formatAccounts);
        setAccountsList(formatAccounts);
        setCurrentAccount(formatAccounts[0]);
      } else {
        customPopup(
          '系統訊息',
          '您目前沒有任何外幣帳戶',
          closeFunc,
        );
      }
    }
  };

  // 取得交易性質
  const getTransTypeOptions = async () => {
    const options = await getExchangePropertyList({ trnsType: 3 });
    console.log('交易性質', options);
    if (Array.isArray(options)) {
      setTransTypeOptions(options);
      setValue('transferType', options[0]?.leglCode);
    }
  };

  // 切換帳戶
  const handleChangeSlide = (swiper) => {
    setCurrentAccount(accountsList[swiper.realIndex]);
  };

  const onSubmit = (data) => {
    const confirmData = {
      // 交易類別
      transType: '3',
      // 轉出帳號
      outAcct: currentAccount.account,
      outCcyCd: currentAccount.currency,
      outAmt: data.balance,
      // 轉入帳號
      inAcct: data.account,
      inCcyCd: currentAccount.currency,
      inAmt: data.balance,
      trfCcyCd: currentAccount.currency,
      rate: '1',
      costRate: '1',
      leglCode: data.transferType,
      leglDesc: transTypeOptions.find((option) => option.leglCode === data.transferType).leglDesc,
      memo: data.memo,
      // 當前餘額
      acctBalance: currentAccount.balance,
    };
    console.log(confirmData);
    history.push('/foreignCurrencyTransfer1', confirmData);
  };

  /**
   * 更新約轉帳號清單。
   */
  const renderAccountsOptions = async () => {
    if (!currentAccount) return null;
    // 取得 約轉帳號清單。
    let accounts = currentAccount.agreedAccts;
    if (!accounts) {
      accounts = await getAgreedAccounts(currentAccount.account);
      currentAccount.agreedAccts = accounts;
    }

    return accounts.map((item) => (
      <FEIBOption key={Math.random()} value={item?.acctId}>{item?.acctId}</FEIBOption>
    ));
  };

  // render 交易性質選項
  const renderTransOptions = () => transTypeOptions.map((option) => (
    <FEIBOption key={option?.leglCode} value={option?.leglCode}>{option?.leglDesc}</FEIBOption>
  ));

  const renderCard = () => accountsList.map((account) => (
    <SwiperSlide key={Math.random()}>
      <DebitCard
        account={account.account}
        cardName={account.name}
        balance={account.balance}
        dollarSign={account.currency}
        color="orange"
      />
    </SwiperSlide>
  ));

  useEffect(() => {
    getForeignCurrencyAccounts();
    getTransTypeOptions();
  }, []);

  useEffect(async () => {
    const accountListOpt = await renderAccountsOptions();
    setAccountListOption(accountListOpt);
  }, [currentAccount]);

  return (
    <Layout title="轉帳">
      <ForeignCurrencyTransferWrapper>
        <div className="userCardArea">
          <Swiper
            slidesPerView={1.14}
            spaceBetween={8}
            centeredSlides
            pagination
            onSlideChange={handleChangeSlide}
          >
            { renderCard() }
          </Swiper>
        </div>
        <div className="formContainer">
          <div className="formTitle">本行同幣別外幣轉帳</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FEIBInputLabel>帳號</FEIBInputLabel>
            <Controller
              name="account"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBSelect
                  {...field}
                  id="account"
                  name="account"
                  error={!!errors.account}
                >
                  <FEIBOption value="" disabled>請選擇轉入帳號</FEIBOption>
                  {accountListOption}
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.account?.message}</FEIBErrorMessage>
            <FEIBInputLabel>金額</FEIBInputLabel>
            <Controller
              name="balance"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <div>
                  <FEIBInput
                    {...field}
                    type="text"
                    inputMode="numeric"
                    id="balance"
                    name="balance"
                    placeholder={`${currencySymbolGenerator(currentAccount.currency)}0（零元）`}
                    error={!!errors.balance}
                    onChange={(event) => {
                      setValue('balance', event.target.value);
                      if (!event.target.value) {
                        setMixBalanceStr('');
                      } else {
                        setMixBalanceStr(`${currencySymbolGenerator(currentAccount.currency)}${event.target.value}${numberToChinese(event.target.value)}`);
                      }
                    }}
                    inputProps={{
                      maxLength: 9,
                      autoComplete: 'off',
                    }}
                  />
                  <div className="balanceLayout">{mixBalanceStr}</div>
                </div>
              )}
            />
            <FEIBErrorMessage>{errors.balance?.message}</FEIBErrorMessage>
            <FEIBInputLabel>匯款性質</FEIBInputLabel>
            <Controller
              name="transferType"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBSelect
                  {...field}
                  id="transferType"
                  name="transferType"
                  error={!!errors.transferType}
                >
                  <FEIBOption value="" disabled>請選擇匯款性質</FEIBOption>
                  {
                    renderTransOptions()
                  }
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.transferType?.message}</FEIBErrorMessage>
            <FEIBInputLabel>備註</FEIBInputLabel>
            <Controller
              name="memo"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBInput
                  {...field}
                  type="text"
                  id="memo"
                  name="memo"
                  placeholder="請輸入"
                  error={!!errors.memo}
                />
              )}
            />
            <FEIBErrorMessage>{errors.memo?.message}</FEIBErrorMessage>
            <Accordion space="top">
              <NoteContent />
            </Accordion>
            <div className="btnContainer">
              <FEIBButton
                type="submit"
              >
                轉帳
              </FEIBButton>
              <div className="warnText">轉帳前多思考，避免被騙更苦惱</div>
            </div>
          </form>
        </div>
      </ForeignCurrencyTransferWrapper>
    </Layout>
  );
};

export default ForeignCurrencyTransfer;
