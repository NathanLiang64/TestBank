/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import Barcode from 'react-barcode';
import { useForm } from 'react-hook-form';
import parse from 'html-react-parser';
import { yupResolver } from '@hookform/resolvers/yup';

import { currencySymbolGenerator } from 'utilities/Generator';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Theme from 'themes/theme';
import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import Badge from 'components/Badge';
import Accordion from 'components/Accordion';
import Loading from 'components/Loading';
import { FEIBButton, FEIBErrorMessage } from 'components/elements';
import { RadioGroupField } from 'components/Fields/radioGroupField';
import { DropdownField, TextInputField } from 'components/Fields';
import BankCodeInputNew from 'components/BankCodeInputNew';
import { closeFunc, loadFuncParams } from 'utilities/AppScriptProxy';
import { showCustomPrompt, showError } from 'utilities/MessageModal';

import { getAccountsList } from 'pages/T00600_MobileTransfer/api';
import {
  getCreditCardTerms,
  makePayment,
  queryCardInfo,
  queryPayBarcode,
} from './api';
import PageWrapper, { PopUpWrapper } from './R00400.style';
import { generateAmountOptions, generateAccountNoOptions } from './utils';
import { TabField } from './tabField/tabField';
import { generateValidationSchema } from './validationSchema';
import {
  AMOUNT_OPTION, paymentMethodOptions, PAYMENT_OPTION, defaultValues,
} from './constants';

/**
 * R00400 信用卡 付款頁
 */
const Page = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [cardInfo, setCardInfo] = useState();
  const [internalAccounts, setInternalAccounts] = useState([]);
  const [terms, setTerms] = useState();
  const {
    control, watch, handleSubmit, reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(generateValidationSchema(cardInfo)),
  });

  const watchedValues = watch();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const accountList = await getAccountsList('M'); // 拿取內部轉出帳號資訊
    const cardInfoResponse = await queryCardInfo(''); // 拿取應繳金額資訊
    if (accountList && cardInfoResponse.data) {
      setInternalAccounts(accountList);
      setCardInfo(cardInfoResponse.data);
    } else {
      closeFunc();
    }
    dispatch(setWaittingVisible(false));
  }, []);

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getCreditCardTerms());
  };

  // 包在 Modal 裡的元件無法取得 terms 必數（不同scope），所以 arrow function call:
  const getTermsFromOutsideModal = () => (terms ? parse(terms) : <Loading space="both" isCentered />);

  const renderBalance = () => {
    if (!internalAccounts.length || !watchedValues.accountNo) return null;
    const {details} = internalAccounts.find((a) => a.account === watchedValues.accountNo);
    return `可用餘額 ${currencySymbolGenerator(details[0].currency, details[0].balance)}元`;
  };

  const renderPaymentCode = async (amount) => {
    const response = await queryPayBarcode(amount);
    if (response.data) {
      await showCustomPrompt({
        title: '超商條碼繳款',
        message: (
          <PopUpWrapper>
            <Badge label="應繳金額" value={currencySymbolGenerator(cardInfo?.newBalance ?? 'NTD', amount)} />
            <p className="note">
              適用商家：
              <wbr />
              四大超商（7-ELEVEN、全家、
              <wbr />
              萊爾富和OK MART）
            </p>

            {Object.keys(response.data).map((key, index) => (
              <Barcode
                key={response.data[key]}
                value={response.data[key]}
                width={1.5}
                height={48}
              />
            ))}

            <Accordion title="注意事項" onClick={lazyLoadTerms}>
              { getTermsFromOutsideModal() }
            </Accordion>
          </PopUpWrapper>
        ),
        noDismiss: true,
      });
    }
  };

  const getAmount = (data) => {
    const {
      amountOption, customAmount,
    } = data;
    switch (amountOption) {
      case AMOUNT_OPTION.CUSTOM:
        return +customAmount;
      case AMOUNT_OPTION.MIN:
        return cardInfo.minDueAmount;
      case AMOUNT_OPTION.ALL:
      default:
        return cardInfo.newBalance;
    }
  };

  const onSubmit = async (data) => {
    console.log('values', data);

    showCustomPrompt({title: '訊息', message: '待串接信用卡繳費API'});
    // let payload;
    // switch (data.paymentMethod) {
    //   case PAYMENT_OPTION.CSTORE:
    //     payload = {
    //       amount: getAmount(data),
    //     };
    //     break;
    //   case PAYMENT_OPTION.EXTERNAL:
    //     payload = {
    //       amount: getAmount(data),
    //       acctBranch: data.bankCode.bankNo,
    //       acctId: data.extAccountNo,
    //     };
    //     break;
    //   case PAYMENT_OPTION.INTERNAL:
    //   default:
    //     payload = {
    //       amount: getAmount(data),
    //       acctBranch: data.accountNo.slice(0, 3),
    //       acctId: data.accountNo,
    //     };
    // }

    // if (data.paymentMethod === PAYMENT_OPTION.CSTORE) {
    //   renderPaymentCode(payload.amount);
    //   return;
    // }

    // const response = await makePayment(payload);
    // history.push('R004001', { isSuccessful: !!response.result, autoDeduct: response.autoDeduct });
  };

  console.log('internalAccounts', internalAccounts);
  return (
    <Layout title="繳款" goBackFunc={closeFunc}>
      <Main small>
        <PageWrapper>
          <Badge label={`${cardInfo?.month}月應繳金額`} value={currencySymbolGenerator('NTD', cardInfo?.newBalance)} />

          <div className="badMargin">
            <TabField
              name="paymentMethod"
              control={control}
              options={paymentMethodOptions}
              resetOnChange={() => reset({...defaultValues})}
            />
          </div>

          <form className="flex" style={{ minHeight: 'initial' }} onSubmit={handleSubmit(onSubmit)}>

            <RadioGroupField
              name="amountOptions"
              labelName="請選擇繳款金額"
              control={control}
              options={generateAmountOptions(cardInfo)}
              resetOnChange={() => reset({...watchedValues, customAmount: null})}

            />

            <div className="ml-4">
              <TextInputField
                type="number"
                control={control}
                name="customAmount"
                placeholder="請輸入金額"
                disabled={watch('amountOptions') !== AMOUNT_OPTION.CUSTOM}
                $color={watchedValues.amountOptions !== AMOUNT_OPTION.CUSTOM ? Theme.colors.text.placeholder : Theme.colors.primary.brand}
              />
            </div>

            { watchedValues.paymentMethod === PAYMENT_OPTION.INTERNAL && (
            <>
              <DropdownField
                name="accountNo"
                labelName="轉出帳號"
                control={control}
                options={generateAccountNoOptions(internalAccounts)}
              />
              <FEIBErrorMessage $color={Theme.colors.text.lightGray}>
                { renderBalance() }
              </FEIBErrorMessage>
            </>
            )}

            { watchedValues.paymentMethod === PAYMENT_OPTION.EXTERNAL && (
              <>
                <BankCodeInputNew
                  control={control}
                  name="bankId"
                  labelName
                />
                <TextInputField
                  name="extAccountNo"
                  labelName="轉出帳號"
                  control={control}
                  placeholder="請輸入轉出帳號"
                />
              </>
            )}

            { watchedValues.paymentMethod !== PAYMENT_OPTION.INTERNAL && (
              <Accordion title="注意事項" onClick={lazyLoadTerms}>
                { terms ? parse(terms) : <Loading space="both" isCentered /> }
              </Accordion>
            )}

            <FEIBButton
              className="mt-4"
              type="submit"
              disabled={cardInfo?.newBalance <= 0}
            >
              {watchedValues.paymentMethod === PAYMENT_OPTION.EXTERNAL ? '同意並送出' : '確認送出'}
            </FEIBButton>
          </form>
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
