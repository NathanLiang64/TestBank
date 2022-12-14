import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import Barcode from 'react-barcode';
import { useForm } from 'react-hook-form';
import parse from 'html-react-parser';
import { yupResolver } from '@hookform/resolvers/yup';

import Theme from 'themes/theme';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { currencySymbolGenerator } from 'utilities/Generator';
import { closeFunc, loadFuncParams, transactionAuth } from 'utilities/AppScriptProxy';
import { showCustomPrompt } from 'utilities/MessageModal';
import Badge from 'components/Badge';
import Main from 'components/Layout';
import Loading from 'components/Loading';
import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import BankCodeInputField from 'pages/R00400_CCPayment/fields/BankCodeInputField';
import { DropdownField, TextInputField } from 'components/Fields';
import { FEIBButton, FEIBErrorMessage } from 'components/elements';
import { RadioGroupField } from 'components/Fields/radioGroupField';

import { AuthCode } from 'utilities/TxnAuthCode';
import { getAccountsList } from 'utilities/CacheData';
import {
  getBankeeCard,
  getCreditCardTerms, payCardFee, queryCardInfo, queryPayBarcode,
} from './api';
import PageWrapper, { PopUpWrapper } from './R00400.style';
import { generateAmountOptions, generateAccountNoOptions } from './utils';
import { TabField } from './fields/TabField/tabField';
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
  const [cardNo, setCardNo] = useState();
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
    let defaultCardNo = null;

    const funcParams = await loadFuncParams(); // Function 啟動參數
    if (funcParams) {
      defaultCardNo = funcParams.cardNo;
    } else {
      // 若從更多 (B00600) 頁面進入，查詢的交易明細就會預設以 bankee 信用卡為主
      const bankeeCardInfo = await getBankeeCard();
      if (bankeeCardInfo) defaultCardNo = bankeeCardInfo.cards[0].cardNo;
      else {
        await showCustomPrompt({
          message: '您尚未持有Bankee信用卡，請在系統關閉此功能後，立即申請。',
          onClose: closeFunc,
        });
      }
    }

    getAccountsList('M', setInternalAccounts); // 拿取本行母帳號列表
    const cardInfoResponse = await queryCardInfo(defaultCardNo); // 拿取應繳金額資訊
    const termsResponse = await getCreditCardTerms(); // 目前是 mockData...

    setCardNo(defaultCardNo);
    setCardInfo(cardInfoResponse);
    setTerms(termsResponse);

    dispatch(setWaittingVisible(false));
  }, []);

  // 繳款金額選項改變時，清空自訂金額的值
  useEffect(() => {
    if (watchedValues.amountOptions) reset((formValues) => ({...formValues, customAmount: null}));
  }, [watchedValues.amountOptions]);

  // 包在 Modal 裡的元件無法取得 terms 必數（不同scope），所以 arrow function call:
  const getTermsFromOutsideModal = () => (terms ? parse(terms) : <Loading space="both" isCentered />);

  const renderBalance = () => {
    if (!internalAccounts.length || !watchedValues.accountNo) return null;
    const foundAccount = internalAccounts.find((a) => a.accountNo === watchedValues.accountNo);
    return `可用餘額 ${currencySymbolGenerator(foundAccount.currency, foundAccount.balance)}元`;
  };

  const renderBarCode = async (amount) => {
    const payBarCodeRes = await queryPayBarcode(amount);
    if (payBarCodeRes) {
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

            {Object.keys(payBarCodeRes).map((key) => (
              <Barcode
                key={payBarCodeRes[key]}
                value={payBarCodeRes[key]}
                width={1.5}
                height={48}
              />
            ))}

            <Accordion title="注意事項">
              { getTermsFromOutsideModal() }
            </Accordion>
          </PopUpWrapper>
        ),
        noDismiss: true,
      });
    }
  };

  const getAmount = ({ amountOptions, customAmount }) => {
    switch (amountOptions) {
      case AMOUNT_OPTION.CUSTOM:
        return customAmount;
      case AMOUNT_OPTION.MIN:
        return cardInfo.minDueAmount;
      case AMOUNT_OPTION.ALL:
      default:
        return cardInfo.newBalance;
    }
  };

  const onSubmit = async (data) => {
    if (data.paymentMethod === PAYMENT_OPTION.INTERNAL) {
      const payload = {
        amount: getAmount(data),
        account: data.accountNo,
        cardNo,
      };
      const {result} = await transactionAuth(AuthCode.R00400);
      if (result) {
        const payResult = await payCardFee(payload);
        if (payResult) history.push('R004001', { payResult, account: data.accountNo });
      }
    }

    if (data.paymentMethod === PAYMENT_OPTION.EXTERNAL) {
      showCustomPrompt({message: 'TODO 他行帳戶繳費API'});
    }

    if (data.paymentMethod === PAYMENT_OPTION.CSTORE) {
      renderBarCode(getAmount(data));
    }
  };

  return (
    <Layout title="繳款" goBackFunc={closeFunc}>
      <Main small>
        <PageWrapper>
          <Badge
            label={`${parseInt(cardInfo?.billClosingDate.slice(5, 7), 10)}月應繳金額`}
            value={currencySymbolGenerator('NTD', cardInfo?.newBalance)}
          />

          <div className="badMargin">
            <TabField
              name="paymentMethod"
              control={control}
              options={paymentMethodOptions}
            />
          </div>

          <form className="flex" style={{ minHeight: 'initial' }} onSubmit={handleSubmit(onSubmit)}>

            <RadioGroupField
              name="amountOptions"
              labelName="請選擇繳款金額"
              control={control}
              options={generateAmountOptions(cardInfo)}
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
                <BankCodeInputField
                  control={control}
                  name="bankId"
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
              <Accordion title="注意事項">
                {getTermsFromOutsideModal()}
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
