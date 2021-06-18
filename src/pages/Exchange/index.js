import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBSelect, FEIBOption, FEIBInputLabel, FEIBInput, FEIBRadio, FEIBRadioLabel, FEIBBorderButton, FEIBButton, FEIBCheckboxLabel, FEIBCheckbox, FEIBErrorMessage,
} from 'components/elements';
import { RadioGroup } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Dialog from 'components/Dialog';
import NoticeArea from 'components/NoticeArea';
import Accordion from 'components/Accordion';
import ExchangeNotice from './exchangeNotice';
import ExchangeTable from './exchangeTable';

/* Styles */
import ExchangeWrapper from './exchange.style';

const Exchange = () => {
  const history = useHistory();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    outAccount: yup
      .string()
      .required('請選擇轉出帳號'),
    currency: yup
      .string()
      .required('請選擇轉帳幣別'),
    inAccount: yup
      .string()
      .required('請選擇轉入帳號'),
    property: yup
      .string()
      .required('請選擇匯款性質'),
    outBalance: yup
      .string()
      .when('outType', {
        is: (val) => val === '1',
        then: yup.string().required('請選擇轉出金額'),
        otherwise: yup.string().notRequired(),
      }),
    inBalance: yup
      .string()
      .when('outType', {
        is: (val) => val === '2',
        then: yup.string().required('請選擇轉入金額'),
        otherwise: yup.string().notRequired(),
      }),
  });
  const {
    handleSubmit, control, formState: { errors }, watch, setValue,
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onBlur',
  });

  const [agree, setAgree] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);

  const handleCheckBoxChange = () => {
    setAgree((prev) => !prev);
  };

  const handleBalanceChange = (event) => {
    setValue(event.target.name, event.target.value);
  };

  const handleTableToggle = () => {
    setShowTableDialog((prev) => !prev);
  };

  const ExchangeTableDialog = () => (
    <Dialog
      title="匯率"
      isOpen={showTableDialog}
      onClose={handleTableToggle}
      content={(<ExchangeTable />)}
      action={(
        <FEIBButton onClick={handleTableToggle}>確定</FEIBButton>
      )}
    />
  );

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    history.push('exchange1');
  };

  useCheckLocation();
  usePageInfo('/api/exchange');

  useEffect(() => {
    setValue('exchangeType', '1');
    setValue('outType', '1');
    setValue('outBalance', '');
    setValue('inBalance', '');
  }, []);

  return (
    <ExchangeWrapper style={{ padding: '2.4rem 1.6rem 2.4rem 1.6rem' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <FEIBInputLabel style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            換匯種類
            <FEIBBorderButton className="customSize" type="button" onClick={handleTableToggle} style={{ margin: '0' }}>
              外匯匯率查詢
            </FEIBBorderButton>
          </FEIBInputLabel>
          <Controller
            name="exchangeType"
            control={control}
            defaultValue="1"
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-label="換匯種類"
                id="exchangeType"
                name="exchangeType"
                defaultValue="1"
                style={{ flexDirection: 'row' }}
              >
                <FEIBRadioLabel value="1" control={<FEIBRadio />} label="台幣轉外幣" />
                <FEIBRadioLabel value="2" control={<FEIBRadio />} label="外幣轉台幣" />
              </RadioGroup>
            )}
          />
          <br />
          <FEIBInputLabel>轉出帳號</FEIBInputLabel>
          <Controller
            name="outAccount"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <FEIBSelect
                {...field}
                id="outAccount"
                name="outAccount"
                error={!!errors.outAccount}
              >
                <FEIBOption value="" disabled>請選擇轉出帳號</FEIBOption>
                <FEIBOption value="1">1</FEIBOption>
                <FEIBOption value="2">2</FEIBOption>
              </FEIBSelect>
            )}
          />
          <FEIBErrorMessage>{errors.outAccount?.message}</FEIBErrorMessage>
          {
            watch('exchangeType') === '1' && <FEIBErrorMessage className="balance">可用餘額</FEIBErrorMessage>
          }
          <FEIBInputLabel>轉帳幣別</FEIBInputLabel>
          <Controller
            name="currency"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <FEIBSelect
                {...field}
                id="currency"
                name="currency"
                error={!!errors.currency}
              >
                <FEIBOption value="" disabled>請選擇轉帳幣別</FEIBOption>
                <FEIBOption value="1">美金</FEIBOption>
                <FEIBOption value="2">日幣</FEIBOption>
              </FEIBSelect>
            )}
          />
          <FEIBErrorMessage>{errors.currency?.message}</FEIBErrorMessage>
          {
            watch('exchangeType') === '2' && <FEIBErrorMessage className="balance">可用餘額</FEIBErrorMessage>
          }
          <FEIBInputLabel>轉入帳號</FEIBInputLabel>
          <Controller
            name="inAccount"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <FEIBSelect
                {...field}
                id="inAccount"
                name="inAccount"
                error={!!errors.inAccount}
              >
                <FEIBOption value="" disabled>請選擇轉入帳號</FEIBOption>
                <FEIBOption value="1">1</FEIBOption>
                <FEIBOption value="2">2</FEIBOption>
              </FEIBSelect>
            )}
          />
          <FEIBErrorMessage>{errors.inAccount?.message}</FEIBErrorMessage>
          <FEIBInputLabel>匯款性質</FEIBInputLabel>
          <Controller
            name="property"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <FEIBSelect
                {...field}
                id="property"
                name="property"
                error={!!errors.property}
              >
                <FEIBOption value="" disabled>請選擇匯款性質</FEIBOption>
                <FEIBOption value="1">1</FEIBOption>
                <FEIBOption value="2">2</FEIBOption>
              </FEIBSelect>
            )}
          />
          <FEIBErrorMessage>{errors.property?.message}</FEIBErrorMessage>
          <Controller
            name="outType"
            control={control}
            defaultValue="1"
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-label="換匯種類"
                id="outType"
                name="outType"
                defaultValue="1"
              >
                <FEIBRadioLabel value="1" control={<FEIBRadio />} label={`希望轉出${watch('exchangeType') === '1' ? '新台幣' : ''}`} />
                <Controller
                  name="outBalance"
                  defaultValue=""
                  control={control}
                  render={({ balanceField }) => (
                    <FEIBInput
                      {...balanceField}
                      type="text"
                      inputMode="numeric"
                      id="outBalance"
                      name="outBalance"
                      placeholder="請輸入轉出金額"
                      error={!!errors.outBalance}
                      disabled={watch('outType') !== '1'}
                      onChange={handleBalanceChange}
                    />
                  )}
                />
                <FEIBErrorMessage>{errors.outBalance?.message}</FEIBErrorMessage>
                <FEIBRadioLabel value="2" control={<FEIBRadio />} label={`希望轉入${watch('exchangeType') === '2' ? '新台幣' : ''}`} />
                <Controller
                  name="inBalance"
                  defaultValue=""
                  control={control}
                  render={({ balanceField }) => (
                    <FEIBInput
                      {...balanceField}
                      type="text"
                      inputMode="numeric"
                      id="inBalance"
                      name="inBalance"
                      placeholder="請輸入轉入金額"
                      error={!!errors.inBalance}
                      disabled={watch('outType') !== '2'}
                      onChange={handleBalanceChange}
                    />
                  )}
                />
                <FEIBErrorMessage>{errors.inBalance?.message}</FEIBErrorMessage>
              </RadioGroup>
            )}
          />
          <FEIBInputLabel>附註</FEIBInputLabel>
          <Controller
            name="memo"
            defaultValue=""
            control={control}
            render={({ balanceField }) => (
              <FEIBInput
                {...balanceField}
                type="text"
                inputMode="numeric"
                id="memo"
                name="memo"
                placeholder="請輸入附註"
                error={!!errors.memo}
              />
            )}
          />
          <FEIBErrorMessage>{errors.memo?.message}</FEIBErrorMessage>
          <NoticeArea title=" " textAlign="left">
            以本行牌告匯率或網銀優惠匯率為成交匯率（預約交易係依據交易日上午09:30最近一盤牌告/網銀優惠匯率為成交匯率）。營業時間以外辦理外匯交易結匯金額併入次營業日累積結匯金額；為網銀優惠將視市場波動清況，適時暫時取消優惠。
          </NoticeArea>
          <FEIBCheckboxLabel
            control={(
              <FEIBCheckbox
                onChange={handleCheckBoxChange}
                checked={agree}
              />
            )}
            label="我已閱讀並同意以上規範"
          />
          <Accordion space="both">
            <ExchangeNotice />
          </Accordion>
          <FEIBButton
            type="submit"
            disabled={!agree}
          >
            確認
          </FEIBButton>
        </section>
      </form>
      <ExchangeTableDialog />
    </ExchangeWrapper>
  );
};

export default Exchange;
