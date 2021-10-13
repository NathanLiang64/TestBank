import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { numberToChinese, currencySymbolGenerator } from 'utilities/Generator';
import { transferAmountValidation } from 'utilities/validation';
/* Elements */
import Accordion from 'components/Accordion';
import DebitCard from 'components/DebitCard';
import {
  FEIBSelect, FEIBOption, FEIBInput, FEIBInputLabel, FEIBButton, FEIBErrorMessage,
} from 'components/elements';
import NoteContent from './noteContent';

/* Styles */
import ForeignCurrencyTransferWrapper from './foreignCurrencyTransfer.style';

// mock data
const mockAccounts = [
  {
    cardBranch: '信義分行',
    cardName: '英鎊',
    dollarSign: 'GBP',
    cardAccount: '04300499001234',
    cardBalance: 5340.56,
    transferRemaining: 3,
  },
  {
    cardBranch: '信義分行',
    cardName: '美金',
    dollarSign: 'USD',
    cardAccount: '04300499001234',
    cardBalance: 5340.56,
    transferRemaining: 3,
  },
];

const mockAccountList = ['00200701710979'];

const ForeignCurrencyTransfer = () => {
  const history = useHistory();
  const [currentAccount, setCurrentAccount] = useState({});
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    account: yup
      .string()
      .required('請選擇轉入帳號'),
    balance: transferAmountValidation(currentAccount.cardBalance),
    transferType: yup
      .string()
      .required('請選擇匯款性質'),
  });
  const {
    handleSubmit, control, formState: { errors }, setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [cardsList, setCardsList] = useState([]);
  const [mixBalanceStr, setMixBalanceStr] = useState('');

  const getForeignCurrencyAccounts = () => {
    setCardsList(mockAccounts);
    setCurrentAccount(mockAccounts[0]);
  };

  const handleChangeSlide = (swiper) => {
    setCurrentAccount(mockAccounts[swiper.realIndex]);
  };

  const onSubmit = (data) => {
    console.log(data);
    history.push('/foreignCurrencyTransfer1');
  };

  const renderOptions = (data) => data.map((item) => (
    <FEIBOption value={item}>{item}</FEIBOption>
  ));

  const renderCard = () => cardsList.map((item) => (
    <SwiperSlide>
      <DebitCard
        branch={item.cardBranch}
        cardName={item.cardName}
        account={item.cardAccount}
        balance={item.cardBalance}
        dollarSign={item.dollarSign}
        transferTitle="跨轉優惠"
        transferLimit={6}
        transferRemaining={item.transferRemaining}
        color="blue"
      />
    </SwiperSlide>
  ));

  useCheckLocation();
  usePageInfo('/api/foreignCurrencyTransfer');

  useEffect(() => {
    getForeignCurrencyAccounts();
    setValue('account', mockAccountList[0]);
    setValue('transferType', '1');
  }, []);

  return (
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
          <div>
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
                  {
                    renderOptions(mockAccountList)
                  }
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
                <>
                  <FEIBInput
                    {...field}
                    type="text"
                    inputMode="numeric"
                    id="balance"
                    name="balance"
                    placeholder={`${currencySymbolGenerator(currentAccount.dollarSign)}0（零元）`}
                    error={!!errors.balance}
                    onChange={(event) => {
                      setValue('balance', event.target.value);
                      if (!event.target.value) {
                        setMixBalanceStr('');
                      } else {
                        setMixBalanceStr(`${currencySymbolGenerator(currentAccount.dollarSign)}${event.target.value}${numberToChinese(event.target.value)}`);
                      }
                    }}
                  />
                  <div className="balanceLayout">{mixBalanceStr}</div>
                </>
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
                  <FEIBOption value="1">不同客戶間外匯轉讓（還款、捐助..）</FEIBOption>
                  <FEIBOption value="2">本人自行帳戶轉帳</FEIBOption>
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
          </div>
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
  );
};

export default ForeignCurrencyTransfer;
