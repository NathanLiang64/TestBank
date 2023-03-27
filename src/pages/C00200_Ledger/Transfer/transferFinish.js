/* eslint-disable no-unused-vars */
import Layout from 'components/Layout/Layout';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router';

import { toCurrency } from 'utilities/Generator';
import CiecleCheckPurple from 'assets/images/icon_circle_check_purple.png';
import { TextInputField } from 'components/Fields';
import { FEIBButton } from 'components/elements';
import { Func } from 'utilities/FuncID';
import { TransferFinishWrapper } from './transfer.style';

const TransferFinish = () => {
  const {state} = useLocation();
  const history = useHistory();

  const {control, reset} = useForm({});

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
        case 'transFee':
          return '轉帳手續費';
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

  const goBack = () => {
    // 返回進入轉帳之前的頁面
    console.log('TransferFinish goBack');
    history.go(-2); // TODO 串進流程後改為-3
  };

  useEffect(() => {
    reset((formValue) => ({
      ...formValue,
      transOutAcct: state.transOutAcct,
      amount: `NTD${toCurrency(state.amount)}`,
      target: state.target,
      transInBank: state.transInBank,
      transInAcct: state.transInAcct,
      transFee: `NTD${state.transFee}`,
      type: state.type,
      memo: state.memo,
    }));
  }, []);
  return (
    <Layout title="轉帳" fid={Func.C002} goBack={false}>
      <TransferFinishWrapper>
        <div className="banner">
          恭喜完成
          <div className="banner_image">
            <img src={CiecleCheckPurple} alt="" />
          </div>
        </div>

        <form className="transfer_form">
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
          {renderViewDataSection('transFee')}
          {renderViewDataSection('type')}
          {renderViewDataSection('memo')}
        </form>
        <FEIBButton onClick={goBack}>返回</FEIBButton>
      </TransferFinishWrapper>
    </Layout>
  );
};

export default TransferFinish;
