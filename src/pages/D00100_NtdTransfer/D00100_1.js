/* eslint-disable object-curly-newline */
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { getBankCode } from 'utilities/Generator';
import { AuthCode } from 'utilities/TxnAuthCode';
import { createNtdTransfer, getDisplayAmount, getTransDate, getCycleDesc } from './api';
import TransferWrapper from './D00100.style';

/**
 * 轉帳確認頁
 * @param {*} { state } 是由轉帳首頁(D00100)傳過來的 Model 資料。
 */
const TransferConfirm = (props) => {
  const { location } = props;
  const { state } = location;

  const history = useHistory();
  const dispatch = useDispatch();

  const [model, setModel] = useState(state);
  const [banks, setBanks] = useState();

  /**
   * 頁面初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    setBanks(await getBankCode());
  }, []);

  /**
   * 初始化完成，關閉等待中狀態。
   */
  useEffect(() => {
    if (model && banks) {
      // 取得銀行名稱。
      const { bankName } = banks?.find((b) => b.bankNo === model.transIn.bank) ?? '';
      // Fix 避免直接 mutate model
      // model.transIn.bankName = bankName; // 因為下一頁也會用到，所以可以先存下來。
      setModel((prevModel) => ({...prevModel, transIn: {...prevModel.transIn, bankName}}));
      dispatch(setWaittingVisible(false));
    }
  }, [banks]);

  /**
   * 執行轉帳程序，包含進行交易驗證。
   */
  const onConfirm = async () => {
    const { transOut, transIn } = model;
    // 常用(freqAcct)/約定(regAcct) 帳號 的物件結構={ bankId, accountNo }
    const quickAcct = [null, transIn.freqAcct, transIn.regAcct][transIn.type];
    const request = {
      transOut: transOut.account,
      transIn: { // 約定帳號 不需要提供額外資訊，由 MBGW 判斷。
        bank: quickAcct?.bankId ?? transIn.bank,
        account: quickAcct?.accountNo ?? transIn.account,
      },
      amount: parseInt(model.amount, 10),
      booking: model.booking,
      memo: model.memo,
    };
    delete request.booking.transTimes;

    // 建立轉帳交易紀錄。
    const response = await createNtdTransfer(request); // 非約轉時，會先由 MBGW 發出 OTP
    console.log(response); // DEBUG
    if (response) {
      // 進行交易驗證，要求使用者輸入OTP、密碼、雙因子...等。
      const auth = await transactionAuth(transIn.type === 2 ? AuthCode.D00100.REG : AuthCode.D00100.NONREG);
      if (auth.result) {
        // 顯示轉帳結果（含加入常用帳號）
        history.push('/D001002', model);
      }
    }
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
  return model ? (
    <Layout title="轉帳確認" goBackFunc={goBack}>
      <TransferWrapper className="transferConfirmPage">
        <hr />
        <section className="transferMainInfo">
          <p>轉出金額與轉入帳號</p>
          <h3 className="transferAmount">{getDisplayAmount(model.amount)}</h3>
          <h3>{`${model.transIn.bankName} (${model.transIn.bank})`}</h3>
          <h3>{model.transIn.account}</h3>
        </section>
        <hr />
        <section>
          <InformationList title="轉出帳號" content={model.transOut.account} remark={model.transOut.alias} />

          <InformationList title="時間" content={getTransDate(model)} />
          {model.booking.mode === 1 && model.booking.multiTimes === '*' && (
            <InformationList
              title="週期"
              content={getCycleDesc(model.booking)}
              remark={model.booking.multiTimes === '*' ? `預計轉帳${model.booking.transTimes}次` : ''}
            />
          )}

          {/* NOTE model 手續費! 還沒轉出，如何顯示？ 9/8 數金：拿掉！ */}
          {/* {model.booking.mode === 0 && <InformationList title="手續費" content="$0" />} */}
          <InformationList title="備註" content={model.memo} />
          <p className="warningText">陌生電話先求證，轉帳匯款須謹慎</p>
        </section>
        <hr />
        <section className="transferAction">
          <div className="transferButtonArea">
            <FEIBButton onClick={onConfirm}>確認</FEIBButton>
          </div>
        </section>
      </TransferWrapper>
    </Layout>
  ) : null;
};

export default TransferConfirm;
