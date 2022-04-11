import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { cardLessATMApi } from 'apis';
import { closeFunc, switchLoading } from 'utilities/BankeePlus';

/* Elements */
import {
  FEIBInput, FEIBInputLabel, FEIBButton, FEIBBorderButton, FEIBErrorMessage,
} from 'components/elements';
import Header from 'components/Header';
import Dialog from 'components/Dialog';
import DebitCard from 'components/DebitCard';
import Accordion from 'components/Accordion';
import { AddCircleRounded, RemoveCircleRounded } from '@material-ui/icons';

/* Styles */
// import theme from 'themes/theme';
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM1 = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    withdrawAmount: yup
      .string()
      .required('請輸入提款金額'),
    // ...passwordValidation,
  });
  const {
    handleSubmit, control, formState: { errors }, setValue, clearErrors, getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const history = useHistory();

  const [accountSummary, setAccountSummary] = useState({
    account: '',
    balance: 0,
    cwdhCnt: '06',
  });

  const amountArr = [1000, 2000, 3000, 5000, 10000, 20000];

  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 跳轉結果頁
  const toResultPage = (data) => {
    history.push('/cardLessATM2', { data });
  };

  // 格式化帳戶餘額
  const toCurrncy = (num) => {
    const arr = num.toString().split('');
    arr.splice(-3, 0, ',');
    return arr.join('');
  };

  // 增減提款金額
  const changeAmount = (type) => {
    const preAmount = getValues('withdrawAmount');
    if (type) {
      if (preAmount >= 20000) {
        return;
      }
      setValue('withdrawAmount', Number(preAmount) + 1000);
    } else {
      if (preAmount <= 1000) {
        return;
      }
      setValue('withdrawAmount', Number(preAmount) - 1000);
    }
  };

  // 發生錯誤開啟 dialog，關閉 dialog 一律通知 app 關閉功能
  const handleDialogOpen = (message) => {
    setErrorMessage(message);
    setOpenDialog(true);
  };

  // 取得提款卡資訊
  const getAccountSummary = async () => {
    switchLoading(true);
    const summaryResponse = await cardLessATMApi.getAccountSummary({ account: '' });
    console.log('取得提款帳號資訊', summaryResponse);
    const { message } = summaryResponse;
    if (!message) {
      setAccountSummary({ ...summaryResponse });
    } else {
      handleDialogOpen(message);
    }
    switchLoading(false);
  };

  // 無卡提款交易
  const cardlessWithdrawApply = async (param) => {
    switchLoading(true);
    const withdrawResponse = await cardLessATMApi.cardLessWithdrawApply(param);
    const { account, withdrawAmount } = param;
    const {
      seqNo, startDateTime, endDateTime, message,
    } = withdrawResponse;
    const data = {
      withdrawalNo: seqNo,
      amount: withdrawAmount,
      account,
      startDateTime,
      endDateTime,
    };

    if (seqNo) {
      console.log('提款結果', data);
      switchLoading(false);
      toResultPage(data);
    } else {
      switchLoading(false);
      handleDialogOpen(message);
    }
  };

  const onSubmit = (data) => {
    const param = {
      ...data,
      account: accountSummary.account,
    };
    if (data.withdrawAmount > accountSummary.balance) {
      handleDialogOpen('提款金額不得大於帳戶餘額');
    } else {
      cardlessWithdrawApply(param);
    }
  };

  const renderWithdrawForm = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <DebitCard
          cardName="存款卡"
          account={accountSummary.account}
          balance={accountSummary.balance}
          transferTitle="跨提優惠"
          transferLimit={6}
          transferRemaining={parseInt(accountSummary.cwdhCnt, 10)}
          color="purple"
        />
        <FEIBInputLabel>您想提領多少錢呢？</FEIBInputLabel>
        <Controller
          name="withdrawAmount"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <>
              <FEIBInput
                {...field}
                type="text"
                inputmode="numeric"
                id="withdrawAmount"
                name="withdrawAmount"
                className="withdrawAmount"
                placeholder="請輸入金額"
                error={!!errors.withdrawAmount}
                disabled
              />
              <div className="addMinusIcons">
                <RemoveCircleRounded onClick={() => changeAmount(0)} />
                <AddCircleRounded onClick={() => changeAmount(1)} />
              </div>
            </>
          )}
        />
        <FEIBErrorMessage>{errors.withdrawAmount?.message}</FEIBErrorMessage>
        <FEIBInputLabel className="limit-label">以千元為單位，單日單次上限＄20,000</FEIBInputLabel>
        <div className="amountButtonsContainer">
          {
            amountArr.map((item) => (
              <div key={item} className="withdrawalBtnContainer">
                <FEIBBorderButton
                  type="button"
                  className="withdrawal-btn customSize"
                  onClick={() => {
                    setValue('withdrawAmount', item);
                    clearErrors('withdrawAmount');
                  }}
                >
                  {
                    toCurrncy(item)
                  }
                </FEIBBorderButton>
              </div>
            ))
          }
        </div>
        <Accordion space="both">
          <ul>
            <li>本交易限時15分鐘內有效，請於交易有效時間內，至本行提供無卡提款功能之ATM完成提款。若逾時請重新申請。(實際交易有效時間以本行系統時間為準)。</li>
            <li>提醒您，ATM提款時請務必確認您的存款餘額是否足夠，避免提款失敗。 </li>
            <li>無卡提款密碼連續錯誤3次，即鎖住服務，須重新申請服務。</li>
          </ul>
        </Accordion>
      </div>
      <FEIBButton
        type="submit"
      >
        確認
      </FEIBButton>
    </form>
  );

  const renderDialog = () => (
    <Dialog
      isOpen={openDialog}
      onClose={() => setOpenDialog(false)}
      content={<p>{errorMessage}</p>}
      action={(
        <FEIBButton onClick={() => closeFunc()}>
          確定
        </FEIBButton>
      )}
    />
  );

  useEffect(() => {
    getAccountSummary();
  }, []);

  return (
    <>
      <Header title="無卡提款" />
      <CardLessATMWrapper>
        {renderWithdrawForm()}
        {renderDialog()}
      </CardLessATMWrapper>
    </>
  );
};

export default CardLessATM1;
