import { useEffect, useState } from 'react';
import DebitCard from 'components/DebitCard';
import {
  FEIBButton, FEIBBorderButton,
  FEIBCheckbox, FEIBCheckboxLabel,
  FEIBRadio, FEIBRadioLabel,
  FEIBInput, FEIBInputLabel,
  FEIBOption, FEIBSelect, FEIBErrorMessage,
} from 'components/elements';
import { RadioGroup } from '@material-ui/core';

/* function */
import { billPayApi } from 'apis';
import { useCheckLocation, usePageInfo } from 'hooks';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

/* Styles */
import theme from 'themes/theme';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { payAmountValidation, bankCodeValidation, transferAccountValidation } from 'utilities/validation';
import BillPayWrapper from './billPay.style';

import { actions } from './stores';

const { init } = billPayApi;
const { setInitData, setPayData } = actions;

// const notZero = (value) => (parseFloat(value) > parseFloat('0'));

const BillPay = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    payType: yup.number(),
    payMoney: yup.number(),
    payAmount: yup.number()
      .when('payMoney', {
        is: 3,
        ...payAmountValidation,
      }),
    otherBankCode: yup.string()
      .when('payType', {
        is: 2,
        ...bankCodeValidation,
      }),
    otherTrnAcct: yup.string()
      .when('payType', {
        is: 2,
        ...transferAccountValidation,
      }),
    sendEmail: yup.boolean(),
    email: yup.string()
      .when('sendEmail', {
        is: true,
        then: yup.string().email('電子信箱格式有誤，請重新檢查。').required('電子信箱尚未填寫，請重新檢查。'),
      }),
  });
  const {
    control, handleSubmit, watch, setValue, trigger, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onBlur',
  });

  const history = useHistory();
  const dispatch = useDispatch();
  const [initData, saveInitData] = useState(null);

  useCheckLocation();
  usePageInfo('/api/billPay');

  useEffect(async () => {
    const data = await init();
    saveInitData(data.initData);
    dispatch(setInitData(data.initData));
    if (data.initData.feib) {
      setValue('payType', 1);
    } else { setValue('payType', 2); }
  }, []);

  useEffect(() => {
    if (watch('payMoney') !== '3') {
      setValue('payAmount', '0');
      trigger('payAmount');
    }
  }, [watch('payMoney')]);

  const moneyreplace = () => {
    const payAmount = watch('payAmount');
    if (payAmount !== '0') {
      setValue('payAmount', payAmount.replace(/\b(0+)/gi, ''));
    }
    if (payAmount === '') {
      setValue('payAmount', '0');
    }
    trigger('payAmount');
  };

  const onSubmit = (data) => {
    if (data.payMoney === 1) {
      data.payAmount = initData.ccToTrcvAmtd;
    }
    if (data.payMoney === 2) {
      data.payAmount = initData.ccMinImPayd;
    }
    dispatch(setPayData(data));
    history.push('/billPay1');
  };
  const goConvenienceStores = () => {
    setValue('payType', 3);
  };

  const renderCardArea = () => {
    const { trnAcct, trnBalance } = initData;
    return (
      <DebitCard
        cardName="存款卡"
        account={trnAcct}
        balance={trnBalance}
        hideIcon
      />
    );
  };

  const renderFormArea = () => {
    const { ccToTrcvAmtd, ccMinImPayd } = initData;
    return (
      <section>
        <div className="formAreaTitle">
          <h2>請選擇繳費金額</h2>
          <FEIBBorderButton className="customSize" type="button">
            申請分期
          </FEIBBorderButton>
        </div>
        <Controller
          name="payType"
          defaultValue={1}
          control={control}
          render={({ field }) => (
            <div>
              <input
                {...field}
                id="payType"
                name="payType"
                type="hidden"
              />
            </div>
          )}
        />
        <Controller
          name="payMoney"
          control={control}
          defaultValue="1"
          render={({ field }) => (
            <RadioGroup
              {...field}
              aria-label="繳費金額"
              id="payMoney"
              name="payMoney"
              defaultValue="1"
            >
              <FEIBRadioLabel value="1" control={<FEIBRadio />} label={`繳全額 NT$${ccToTrcvAmtd}`} />
              <FEIBRadioLabel value="2" control={<FEIBRadio />} label={`繳最低 NT$${ccMinImPayd}`} />
              <FEIBRadioLabel value="3" control={<FEIBRadio />} label="自訂金額" />
            </RadioGroup>
          )}
        />
        <Controller
          name="payAmount"
          control={control}
          defaultValue="0"
          render={({ field }) => (
            <div>
              <span className="smallFontSize">$</span>
              <FEIBInput
                {...field}
                className="customStyles"
                id="payAmount"
                name="payAmount"
                type="text"
                onBlur={() => moneyreplace()}
              />
            </div>
          )}
        />
        <FEIBErrorMessage>{errors.payAmount?.message}</FEIBErrorMessage>
      </section>
    );
  };

  const renderOtherCCArea = () => (
    <section>
      <h2>請選擇繳費帳戶</h2>
      <div>
        <FEIBInputLabel htmlFor="otherBankCode">請選擇轉出行庫</FEIBInputLabel>
        <Controller
          name="otherBankCode"
          control={control}
          defaultValue="aaa"
          render={({ field }) => (
            <FEIBSelect
              {...field}
              id="otherBankCode"
              name="otherBankCode"
            >
              <FEIBOption value="aaa">AAA行庫</FEIBOption>
              <FEIBOption value="bbb">BBB行庫</FEIBOption>
            </FEIBSelect>
          )}
        />
        <FEIBErrorMessage>{errors.otherBankCode?.message}</FEIBErrorMessage>
      </div>

      <div>
        <FEIBInputLabel htmlFor="otherTrnAcct">請輸入轉出帳號</FEIBInputLabel>
        <Controller
          name="otherTrnAcct"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FEIBInput
              {...field}
              id="otherTrnAcct"
              name="otherTrnAcct"
              placeholder="請輸入轉出帳號"
              type="number"
              error={!!errors.otherTrnAcct}
            />
          )}
        />
        <FEIBErrorMessage>{errors.otherTrnAcct?.message}</FEIBErrorMessage>
      </div>

      <div>
        <Controller
          name="sendEmail"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FEIBCheckboxLabel
              control={(
                <FEIBCheckbox
                  {...field}
                  className="customPadding"
                />
              )}
              label="當轉帳交易成功，發送簡訊通知至您的信箱"
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FEIBInput
              {...field}
              id="email"
              name="email"
              placeholder="請輸入E-mail"
              className="customTopSpace"
            />
          )}
        />
        <FEIBErrorMessage>{errors.email?.message}</FEIBErrorMessage>
      </div>
    </section>
  );

  const renderButtons = () => (
    <div className="buttons">
      <FEIBButton
        $color={theme.colors.text.dark}
        $bgColor={theme.colors.background.cancel}
        type="submit"
      >
        下一步
      </FEIBButton>
      <FEIBButton type="submit" onClick={goConvenienceStores}>超商條碼繳費</FEIBButton>
    </div>
  );

  const renderPage = () => (
    <BillPayWrapper small={initData && initData.feib}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {initData && initData.feib ? renderCardArea() : null}
        {initData && renderFormArea()}
        {initData && !initData.feib ? renderOtherCCArea() : null}
        {initData && renderButtons()}
      </form>
    </BillPayWrapper>
  );

  return renderPage();
};

export default BillPay;
