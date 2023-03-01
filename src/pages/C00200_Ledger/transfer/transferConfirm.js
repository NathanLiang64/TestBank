/* eslint-disable no-unused-vars */
import { TextInputField } from 'components/Fields';
import Layout from 'components/Layout/Layout';
import { useHistory, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { toCurrency } from 'utilities/Generator';
import Accordion from 'components/Accordion';
import { FEIBButton } from 'components/elements';
import CiecleCheckPurple from 'assets/images/icon_circle_check_purple.png';
import C002TransferAccordionContent from './accordionContent';
import { TransferConfirmWrapper } from './transfer.style';
import { transfer } from './api';

const TransferConfirm = () => {
  const history = useHistory();
  const {state} = useLocation();

  const {control, handleSubmit, reset} = useForm({
    defaultValues: {
      transOutAcct: undefined,
      amount: '0',
      target: undefined,
      transInBank: undefined,
      transInAcct: undefined,
      type: '1',
      memo: undefined,
    },
  });

  const renderViewDataSection = (name) => {
    const handleLabelName = () => {
      switch (name) {
        case 'transOutAcct':
          return '轉出帳號';
        case 'amount':
          return '金額';
        case 'target':
          return '對象';
        case 'transInBank':
          return '銀行代碼';
        case 'transInAcct':
          return '轉入帳號';
        case 'type':
          return '性質';
        case 'memo':
          return '備註';
        default:
          return '';
      }
    };

    return (
      <TextInputField
        type="text"
        name={name}
        control={control}
        labelName={handleLabelName()}
        inputProps={{ disabled: true }}
      />
    );
  };

  const onSubmit = (data) => {
    const dataToSend = {
      ...data,
      amount: parseInt(data.amount.replace(/[^0-9]/g, ''), 10),
    };
    console.log('TransferConfirm', {dataToSend});
    // TODO send transfer req
    const result = transfer(dataToSend);
    history.push('/transferFinish', result);
  };

  const goBack = () => history.goBack();

  useEffect(() => {
    reset((formValues) => ({
      ...formValues,
      transOutAcct: state.transOutAcct,
      amount: `NTD${toCurrency(state.amount)}`,
      target: state.target,
      transInBank: state.transInBank,
      transInAcct: state.transInAcct,
      type: state.type,
      memo: state.memo,
    }));
  }, []);
  return (
    <Layout title="轉帳" goBackFunc={goBack}>
      <TransferConfirmWrapper>
        <div className="banner">
          資料確認
          <div className="banner_image">
            <img src={CiecleCheckPurple} alt="" />
          </div>
        </div>
        <form className="transfer_form" onSubmit={handleSubmit((data) => onSubmit(data))}>
          <div>
            {renderViewDataSection('transOutAcct')}
            <div className="transout_info_wrapper">
              <div>
                可用餘額 NTD
                {state.remainAmount}
              </div>
            </div>
          </div>
          {renderViewDataSection('amount')}
          {renderViewDataSection('target')}
          {renderViewDataSection('transInBank')}
          {renderViewDataSection('transInAcct')}
          {renderViewDataSection('type')}
          {renderViewDataSection('memo')}
          <Accordion space="both">
            <C002TransferAccordionContent />
          </Accordion>
          <FEIBButton type="submit">確認</FEIBButton>
        </form>
      </TransferConfirmWrapper>
    </Layout>
  );
};

export default TransferConfirm;
