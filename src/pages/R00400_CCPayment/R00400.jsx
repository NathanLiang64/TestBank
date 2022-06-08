import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { RadioGroup } from '@material-ui/core';
import parse from 'html-react-parser';
import uuid from 'react-uuid';

import {
  accountFormatter,
  currencySymbolGenerator,
} from 'utilities/Generator';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Theme from 'themes/theme';
import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import Badge from 'components/Badge';
import Accordion from 'components/Accordion';
import Loading from 'components/Loading';
import BankCodeInput from 'components/BankCodeInput';
import {
  FEIBRadioLabel,
  FEIBRadio,
  FEIBButton,
  FEIBInputLabel,
  FEIBInput,
  FEIBErrorMessage,
  FEIBSelect,
  FEIBOption,
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
} from 'components/elements';

import {
  getBills,
  getCreditCardTerms,
} from './api';
import PageWrapper from './R00400.style';

/**
 * R00400 信用卡 付款頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const {
    control, watch, handleSubmit, formState: { errors }, trigger, setValue,
  } = useForm();

  const [paymentOption, setPaymentOption] = useState('self');
  const [bills, setBills] = useState();
  const [terms, setTerms] = useState();

  const uid = Array.from({ length: 4}, () => uuid());

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getBills(true);
    setBills(response);
    dispatch(setWaittingVisible(false));
  }, []);

  const handleOnTabChange = (_, id) => {
    setPaymentOption(id);
  };

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getCreditCardTerms());
  };

  const renderBalance = () => {
    if (!bills || !watch('account')) return undefined;
    return currencySymbolGenerator(bills.currency ?? 'NTD', bills.accounts.find((a) => a.accountNo === watch('account'))?.balance);
  };

  const onSubmit = (data) => {
    console.debug('onSubmit', data);
  };

  return (
    <Layout title="繳款" hasClearHeader>
      <Main small>
        <PageWrapper>
          <Badge label={`${bills?.month}月應繳金額`} value={currencySymbolGenerator(bills?.currency ?? 'NTD', bills?.amount)} />

          <div className="badMargin">
            <FEIBTabContext value={paymentOption}>
              <FEIBTabList onChange={handleOnTabChange}>
                <FEIBTab label="本行帳戶" value="self" />
                <FEIBTab label="他行帳戶" value="external" />
                <FEIBTab label="超商條碼" value="store" />
              </FEIBTabList>
            </FEIBTabContext>
          </div>

          <form className="flex" style={{ minHeight: 'initial' }} onSubmit={handleSubmit(onSubmit)}>

            <fieldset>
              <legend className="sr-only">請選擇繳款金額</legend>
              <Controller
                name="amountOption"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <FEIBRadioLabel control={<FEIBRadio />} label={`本期應繳金額 ${currencySymbolGenerator(bills?.currency ?? 'NTD', bills?.amount)}`} value="all" />
                    <FEIBRadioLabel control={<FEIBRadio />} label={`最低應繳金額 ${currencySymbolGenerator(bills?.currency ?? 'NTD', bills?.minAmount)}`} value="min" />
                    <FEIBRadioLabel control={<FEIBRadio />} label="自訂金額" value="custom" />
                  </RadioGroup>
                )}
              />
            </fieldset>

            <div className="ml-4">
              <FEIBInputLabel className="sr-only" htmlFor={uid[0]}>自訂金額</FEIBInputLabel>
              <Controller
                name="customAmount"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FEIBInput
                    id={uid[0]}
                    type="number"
                    placeholder="請輸入金額"
                    {...field}
                  />
                )}
              />
              <FEIBErrorMessage />
            </div>

            <FEIBInputLabel htmlFor={uid[1]}>轉出帳號</FEIBInputLabel>
            <Controller
              name="account"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FEIBSelect id={uid[1]} {...field}>
                  { bills?.accounts.map((v) => (
                    <FEIBOption key={uuid()} value={v.accountNo}>{accountFormatter(v.accountNo)}</FEIBOption>
                  ))}
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage $color={Theme.colors.text.lightGray}>
              { renderBalance() && `可用餘額 ${renderBalance()}` }
            </FEIBErrorMessage>

            <BankCodeInput
              id="bankCode"
              setValue={setValue}
              trigger={trigger}
              control={control}
              errorMessage={errors.bankCode?.message}
            />

            <FEIBInputLabel htmlFor={uid[3]}>轉出帳號</FEIBInputLabel>
            <Controller
              name="ext-account"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FEIBInput
                  id={uid[3]}
                  type="text"
                  placeholder="請輸入"
                  {...field}
                />
              )}
            />
            <FEIBErrorMessage />

            <Accordion title="注意事項" className="terms" onClick={lazyLoadTerms}>
              { terms ? parse(terms) : <Loading space="both" isCentered /> }
            </Accordion>

            <FEIBButton className="mt-4" type="submit">{paymentOption === 'external' ? '同意並送出' : '確認送出'}</FEIBButton>
          </form>
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
