/* eslint-disable object-curly-newline */
/* eslint-disable no-use-before-define */
import { useEffect, useReducer } from 'react';
import { useHistory } from 'react-router';

import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';

import { transactionAuth } from 'utilities/AppScriptProxy';
import { getAccountsList, getBankCode, updateAccount } from 'utilities/CacheData';
import { showError } from 'utilities/MessageModal';
import { Func } from 'utilities/FuncID';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { createNtdTransfer, executeNtdTransfer } from './api';
import { getTransInData, getDisplayAmount, getTransDate, getCycleDesc } from './util';
import TransferWrapper from './D00100.style';

/**
 * 轉帳確認頁
 * @param {*} { state } 是由轉帳首頁(D00100)傳過來的 Model 資料。
 */
const TransferConfirm = (props) => {
  const { location } = props;
  const { state } = location;

  const history = useHistory();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const dispatch = useDispatch();

  const model = state;
  const transInData = getTransInData(model.transIn);

  /**
   * 頁面初始化
   */
  useEffect(async () => {
    getBankCode().then((items) => {
      if (model) {
        // 取得銀行名稱。
        const { bankName } = items.find((b) => b.bankNo === model.transIn.bank) ?? '';
        model.transIn.bankName = bankName; // 因為下一頁也會用到，所以可以先存下來。
        forceUpdate();
      }
    });
  }, []);

  /**
   * 執行轉帳程序，包含進行交易驗證。
   */
  const onConfirm = async () => {
    const { transOut, transIn } = model;
    const request = {
      transOut: transOut.account,
      transIn: { // 不需要額外指出是否為約定轉號，由 Controller 判斷，並傳回。
        bank: transInData.bank,
        account: transInData.account,
      },
      amount: model.amount,
      booking: model.booking,
      memo: model.memo,
    };

    // 建立轉帳交易紀錄。
    dispatch(setWaittingVisible(true));

    const response = await createNtdTransfer(request);
    if (response.result) {
      // 以 Server端傳回的約轉帳號旗標為準。
      if (response.isAgreedTxn) {
        model.transIn.type = 2;
        // 找出目前轉出帳號的所有約定轉入帳號中，與目前轉出帳號相符者；存入 model.transIn.regAcct 使畫面正確顯示。
        model.transIn.regAcct = {
          bankId: transIn.bank,
          bankName: transIn.bankName,
          accountNo: transIn.account,
        };
      } else transIn.type = (transIn.freqAcct ? 1 : 0);

      // 進行交易驗證，要求使用者輸入OTP、密碼、雙因子...等。
      const authCode = (response.isAgreedTxn) ? Func.D00100_臺幣轉帳.authCode.REG : Func.D00100_臺幣轉帳.authCode.NONREG;
      const auth = await transactionAuth(authCode);
      if (auth.result) {
        const result = await executeTransfer();
        // 顯示轉帳結果（含加入常用帳號）
        const param = {...model, result};
        history.push('/D001002', param);
      }
    } else {
      // 顯示失敗原因，並回到前一頁；若是嚴重錯誤，會在 axios 就處理掉了。
      await showError(response.message, goBack);
    }
    dispatch(setWaittingVisible(false));
  };

  /**
   * 執行轉帳交易。
   * @returns {Promise<{
   *    isSuccess,
   *    balance: 轉出後餘額,
   *    fee: 手續費,
   *    isCrossBank: 表示跨轉轉帳,
   *    fiscCode: 財金序號_跨轉才有,
   *    errorCode,
   *    message: 錯誤訊息,
   * }>} 轉帳結果。
   */
  const executeTransfer = async () => {
    // TODO 顯示交易授權中，請稍候...
    const executeRs = await executeNtdTransfer();
    console.log('==> 轉帳執行結果：', executeRs);

    const result = {
      ...executeRs,
      isCrossBank: (transInData.bank !== '805' && executeRs.fee === 0), // 表示跨轉轉帳
    };

    if (result.isSuccess) {
      if (result.balance !== (model.transOut.balance - model.amount - executeRs.fee)) alert(`餘額不一致：${model.transOut.balance - model.amount - executeRs.fee}`); // DEBUG
      model.transOut.balance = executeRs.balance;
      if (result.isCrossBank) model.transOut.freeTransferRemain -= 1; // 跨轉優惠次數

      // 更新快取（跨轉優惠次數、餘額）
      getAccountsList('MSC', async (accounts) => {
        const account = accounts.find((acc) => acc.accountNo === model.transOut.account);
        updateAccount({
          ...account,
          balance: executeRs.balance, // 更新 餘額
          bonus: {
            ...account.bonus,
            freeTransferRemain: model.transOut.freeTransferRemain, // 更新 跨轉優惠次數
          },
        });
      });
    }

    return result;
  };

  /**
   *返回轉帳首頁。
   */
  const goBack = () => {
    history.replace('/D00100', model);
  };

  /**
   * 頁面輸出。
   */
  return (
    <Layout title="轉帳確認" goBackFunc={goBack}>
      <TransferWrapper className="transferConfirmPage">
        <hr />
        <section className="transferMainInfo">
          <p>轉出金額與轉入帳號</p>
          <h3 className="transferAmount">{getDisplayAmount(model.amount)}</h3>
          <h3>{`${transInData.bankName} (${transInData.bank})`}</h3>
          <h3>{transInData.account}</h3>
          {transInData.accountName && (<h4>{transInData.accountName}</h4>)}
        </section>
        <hr />
        <section>
          <InformationList title="轉出帳號" content={model.transOut.account} remark={model.transOut.alias} />

          <InformationList title="時間" content={getTransDate(model.booking)} />
          {model.booking.mode === 1 && model.booking.multiTimes === '*' && (
            <InformationList
              title="週期"
              content={getCycleDesc(model.booking)}
              remark={model.booking.multiTimes === '*' ? `預計轉帳${model.booking.transTimes}次` : ''}
            />
          )}

          <InformationList title="備註" content={model.memo} />
          <p className="warningText">陌生電話先求證，轉帳交易須謹慎</p>
        </section>
        <hr />
        <section className="transferAction">
          <div className="transferButtonArea">
            <FEIBButton onClick={onConfirm}>確認</FEIBButton>
          </div>
        </section>
      </TransferWrapper>
    </Layout>
  );
};

export default TransferConfirm;
