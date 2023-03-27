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
import CountDown from 'components/CountDown';
import C002TransferAccordionContent from './accordionContent';
import { TransferConfirmWrapper } from './transfer.style';
import { preTransfer, transfer } from './api';

const TransferConfirm = () => {
  const history = useHistory();
  const {state} = useLocation();
  const [countDownTimer, setCountDownTimer] = useState(300);

  const {control, handleSubmit, reset} = useForm({
    defaultValues: {
      transOutAcct: '',
      amount: '0',
      target: '',
      transInBank: '',
      transInAcct: '',
      type: '1',
      memo: '',
      otpInput: '',
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

  const apiPreTransfer = async () => {
    const response = await preTransfer();

    console.log('apiPreTransfer', {response});
    // TODO set response (countdown seconds and more?) to useState
    // setCountDownTimer(response.otpCountDown); // TODO 確認key name
  };

  const onOtpExpire = () => {
    // TODO 確認otp過期後行為
    apiPreTransfer();
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
    reset((formValue) => ({
      ...formValue,
      ...state,
      amount: `NTD${toCurrency(state.amount)}`,
    }));

    // TODO api preTransfer: get otp countdown time and code?
    apiPreTransfer();
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

          {/* OTP 倒數、輸入 */}
          <div className="otp_container">
            <TextInputField
              type="text"
              control={control}
              name="otpInput"
              labelName="OTP驗證碼"
            />
            <div className="timer_wrapper">
              <div className="timer_text">剩餘時間</div>
              <CountDown
                seconds={countDownTimer}
                onEnd={onOtpExpire}
                replay
              />
            </div>
          </div>
          <FEIBButton type="submit">確認</FEIBButton>
        </form>
      </TransferConfirmWrapper>
    </Layout>
  );
};

export default TransferConfirm;
