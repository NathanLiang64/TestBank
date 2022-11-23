import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import { FEIBButton} from 'components/elements';
import DebitCard from 'components/DebitCard/DebitCard';
import Accordion from 'components/Accordion';
import { closeFunc, transactionAuth } from 'utilities/AppScriptProxy';
import { showCustomPrompt, showError } from 'utilities/MessageModal';
import { AuthCode } from 'utilities/TxnAuthCode';
import { getAccountSummary, cardLessWithdrawApply } from 'pages/D00300_CardLessATM/api';

import CardLessATMWrapper from './D00300.style';
import { CustomInputSelectorField } from './fields/CustomInputSelectorField';
import { validationSchema } from './validationSchema';

const CardLessATM1 = () => {
  const defaultValues = {
    withdrawAmount: 0,
    account: '',
  };

  const {handleSubmit, control, reset } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const history = useHistory();
  const dispatch = useDispatch();

  const [accountSummary, setAccountSummary] = useState({
    account: '',
    balance: 0,
    cwdhCnt: '06',
  });

  // 無卡提款交易
  const requestCardlessWithdrawApply = async (param) => {
    const {result} = await transactionAuth(AuthCode.D00300);
    if (result) {
      const {
        seqNo, startDateTime, endDateTime, message,
      } = await cardLessWithdrawApply(param);

      const { account, withdrawAmount } = param;
      const data = {
        seqNo,
        withdrawAmount,
        account,
        startDateTime,
        endDateTime,
      };

      if (seqNo) {
        console.log('提款結果', data);
        // 跳轉結果頁
        history.push('/D003002', { data });
      } else {
        showCustomPrompt({
          message, okContent: '確認', onOk: () => closeFunc(), onClose: () => closeFunc(),
        });
      }
    }
  };

  const onSubmit = (values) => {
    if (values.withdrawAmount > accountSummary.balance) {
      showError('提款金額不得大於帳戶餘額');
    } else {
      requestCardlessWithdrawApply(values);
    }
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 取得提款卡資訊
    const data = await getAccountSummary();
    if (data) {
      setAccountSummary({ ...data });
      reset({...defaultValues, account: data.account});
    }

    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="無卡提款">
      <CardLessATMWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <DebitCard
              cardName="存款卡"
              account={accountSummary.account}
              balance={accountSummary.balance}
              withdrawMode
              freeWithdraw={6} // 目前 hardcode
              freeWithdrawRemain={parseInt(accountSummary.cwdhCnt, 10)}
              color="purple"
            />
            <CustomInputSelectorField
              control={control}
              name="withdrawAmount"
              placeholder="請輸入金額"
              labelName="您想提領多少錢呢？"
            />

            <Accordion space="both">
              <ul>
                <li>
                  本交易限時15分鐘內有效，請於交易有效時間內，至本行提供無卡提款功能之ATM完成提款。若逾時請重新申請。(實際交易有效時間以本行系統時間為準)。
                </li>
                <li>
                  提醒您，ATM提款時請務必確認您的存款餘額是否足夠，避免提款失敗。
                  {' '}
                </li>
                <li>無卡提款密碼連續錯誤3次，即鎖住服務，須重新申請服務。</li>
              </ul>
            </Accordion>
          </div>
          <FEIBButton type="submit">確認</FEIBButton>
        </form>
      </CardLessATMWrapper>
    </Layout>
  );
};

export default CardLessATM1;
