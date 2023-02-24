/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { TextInputField, DropdownField } from 'components/Fields';
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import BankCodeInput from 'components/BankCodeInput';
import { FEIBButton } from 'components/elements';

import {TransferPageWrapper} from './transfer.style';
import C002TransferAccordionContent from './accordionContent';
import { transferSettingInitialData } from './mockData';
import { getBonusInfo } from './api';

/**
 * C002 社群帳本 - 轉帳
 */
const TransferSetting = () => {
  const history = useHistory();
  const [transData, setTransData] = useState();
  const [bonusInfo, setBonusInfo] = useState();

  /**
   * 資料驗證
   */
  const schema = yup.object().shape({
    transOutAcct: yup.string().required(),
    amount: yup.string().required(),
    target: yup.string().required(),
    transInBank: yup.string().required(),
    transInAcct: yup.string().required(),
    type: yup.string().required(),
    memo: yup.string(),
  });
  const {
    control, handleSubmit, reset, setValue, getValues, trigger,
  } = useForm({
    defaultValues: {
      transOutAcct: undefined,
      amount: '0',
      target: undefined,
      transInBank: undefined,
      transInAcct: undefined,
      type: '1',
      memo: undefined,
    },
    resolver: yupResolver(schema),
  });

  const warningText = (text) => (
    <div className="warning_text">
      ※
      {text}
    </div>
  );

  const typeOptions = [
    {
      label: '食',
      value: '1',
    },
    {
      label: '衣',
      value: '2',
    },
    {
      label: '住',
      value: '3',
    },
    {
      label: '行',
      value: '4',
    },
    {
      label: '育',
      value: '5',
    },
    {
      label: '樂',
      value: '6',
    },
    {
      label: '其他',
      value: '7',
    },
  ];

  const onSubmit = (data) => {
    console.log('Transfer onSubmit', {data});
    // TODO: to confirm page with data
    history.push('/transferConfirm', data);
  };

  /**
   * owner, member透過要錢卡進轉帳：帶入 '轉出帳號、金額、對象、銀行代號、轉入帳號、性質、備註'
   * owner 點擊'給錢'進轉帳：帶入 '轉出帳號'
   * 有帶入參數者皆不可修改
   */
  useEffect(() => {
    const initialData = transferSettingInitialData; // TODO: 從前一頁面帶入
    setTransData(initialData);

    reset((formValues) => ({
      ...formValues,
      transOutAcct: initialData.transOut,
      amount: initialData.amount,
      target: initialData.target,
      transInBank: initialData.transIn.bank,
      transInAcct: initialData.transIn.account,
      type: initialData.usageType,
      memo: initialData.memo,
    }));
  }, []);

  // 取得可用餘額＆跨轉優惠
  useEffect(() => {
    const result = getBonusInfo();
    setBonusInfo(result);
  }, []);

  const goBack = () => history.goBack();

  return (
    <Layout title="轉帳" goBackFunc={goBack}>
      <TransferPageWrapper>
        {transData && (
        <form className="transfer_form" onSubmit={handleSubmit((data) => onSubmit(data))}>
          <div>
            <TextInputField labelName="轉出帳號" type="text" control={control} name="transOutAcct" inputProps={{placeholder: '轉出帳號', inputMode: 'numeric', disabled: !!transData.transOut}} />
            <div className="transout_info_wrapper">
              <div>
                可用餘額 NTD
                {bonusInfo.remainAmount}
              </div>
              <div>
                跨轉優惠
                {bonusInfo.freeTransOutTimes}
                次
              </div>
            </div>
          </div>
          {warningText('轉出帳號不能跟轉入帳號一樣呦～')}
          <TextInputField labelName="金額" type="text" control={control} name="amount" inputProps={{placeholder: '金額', inputMode: 'numeric', disabled: !!transData.amount}} />
          <TextInputField labelName="對象" type="text" control={control} name="target" inputProps={{placeholder: '對象', disabled: !!transData.target}} />
          <BankCodeInput control={control} name="transInBank" readonly={!!transData.transInBank} setValue={setValue} value={getValues('transInBank')} trigger={trigger} />
          <TextInputField labelName="轉入帳號" type="text" control={control} name="transInAcct" inputProps={{placeholder: '轉入帳號', inputMode: 'numeric', disabled: !!transData.transInAccount}} />
          <DropdownField labelName="性質" options={typeOptions} name="type" control={control} inputProps={{disabled: !!transData.usageType}} />
          <TextInputField labelName="備註" type="text" control={control} name="memo" inputProps={{placeholder: '備註', disabled: !!transData.memo}} />
          {warningText('轉帳前請多思考，避免被騙更苦惱')}

          <Accordion space="both">
            <C002TransferAccordionContent />
          </Accordion>

          <FEIBButton type="submit">確認</FEIBButton>
        </form>
        )}

      </TransferPageWrapper>
    </Layout>
  );
};

export default TransferSetting;
