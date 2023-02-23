/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { TextInputField, DropdownField } from 'components/Fields';
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import { FEIBButton } from 'components/elements';

import TransferPageWrapper from './transfer.style';
import C002TransferAccordionContent from './accordionContent';

/**
 * C002 社群帳本 - 轉帳
 */
const TransferSetting = () => {
  const [transData, setTransData] = useState();

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
  const {control, handleSubmit, reset} = useForm({
    defaultValues: {
      transOutAcct: '',
      amount: '',
      target: '',
      transInBank: '',
      transInAcct: '',
      type: '',
      memo: '',
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
      value: '001',
    },
    {
      label: '衣',
      value: '002',
    },
    {
      label: '住',
      value: '003',
    },
    {
      label: '行',
      value: '004',
    },
    {
      label: '育',
      value: '005',
    },
    {
      label: '樂',
      value: '006',
    },
  ];

  const onSubmit = (data) => {
    console.log('Transfer onSubmit', {data});
    // TODO: set data to transData
    // TODO: to confirm page with transData
  };

  /**
   * owner, member透過要錢卡進轉帳：帶入 '轉出帳號、金額、對象、銀行代號、轉入帳號、性質、備註'
   * owner 點擊'給錢'進轉帳：帶入 '轉出帳號'
   * 有帶入參數者皆不可修改
   */
  useEffect(() => {
    const mockModel = {
      transOut: '01234567890000',
      amount: 10,
      transIn: {
        bank: '043',
        account: '00011122334455',
      },
      target: '帳本',
      usageType: '001',
      memo: 'Test',
    }; // TODO: 從前一頁面帶入

    reset((formValues) => ({
      ...formValues,
      transOutAcct: mockModel.transOut,
      amount: mockModel.amount,
      target: mockModel.target,
      transInBank: mockModel.transIn.bank,
      transInAcct: mockModel.transIn.account,
      type: mockModel.usageType,
      memo: mockModel.memo,
    }));
  }, []);

  return (
    <Layout title="轉帳">
      <TransferPageWrapper>
        <form className="transfer_form" onSubmit={handleSubmit((data) => onSubmit(data))}>
          <div>
            <TextInputField labelName="轉出帳號" type="text" control={control} name="transOutAcct" inputProps={{placeholder: '轉出帳號', inputMode: 'numeric'}} />
            <div className="transout_info_wrapper">
              <div>可用餘額 NTD???</div>
              <div>跨轉優惠??次</div>
            </div>
          </div>
          {warningText('轉出帳號不能跟轉入帳號一樣呦～')}
          <TextInputField labelName="金額" type="text" control={control} name="amount" inputProps={{placeholder: '金額', inputMode: 'numeric'}} />
          <TextInputField labelName="對象" type="text" control={control} name="target" inputProps={{placeholder: '對象'}} />
          <TextInputField labelName="銀行代號" type="text" control={control} name="transInBank" inputProps={{placeholder: '銀行代號', inputMode: 'numeric'}} />
          <TextInputField labelName="轉入帳號" type="text" control={control} name="transInAcct" inputProps={{placeholder: '轉入帳號', inputMode: 'numeric'}} />
          <DropdownField labelName="性質" options={typeOptions} name="type" control={control} />
          <TextInputField labelName="備註" type="text" control={control} name="memo" inputProps={{placeholder: '備註'}} />
          {warningText('轉帳前請多思考，避免被騙更苦惱')}

          <Accordion space="both">
            <C002TransferAccordionContent />
          </Accordion>

          <FEIBButton type="submit">確認</FEIBButton>
        </form>

      </TransferPageWrapper>
    </Layout>
  );
};

export default TransferSetting;
