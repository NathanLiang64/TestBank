import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { dateToString } from 'utilities/Generator';
import { getBankCode } from 'components/BankCodeInput/api';
// import { doBookNtdTrConfirm, doTransfer } from 'apis/transferApi';
import TransferWrapper from './D00100.style';

const TransferConfirm = (props) => {
  const { location } = props;
  const { state } = location;

  const history = useHistory();
  const dispatch = useDispatch();

  const [model] = useState(state);
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
  useEffect(async () => {
    if (model) dispatch(setWaittingVisible(false));
  }, [model]);

  /**
   * 將轉帳金額加標千分位符號及前置'$'.
   */
  const getDisplayAmount = (amount) => `$${new Intl.NumberFormat('en-US').format(amount)}`;

  /**
   * 取得銀行名稱。
   */
  const getBankName = (bankId) => {
    const { bankName } = banks?.find((b) => b.bankNo === bankId) ?? '';
    return `${bankName} (${bankId})`;
  };

  /**
   * 產生轉帳發生時間或區間的描述訊息。
   */
  const getTransDate = () => {
    const { booking } = model;

    if (!booking?.mode) return dateToString(new Date()); // 立即轉帳 用今天表示。

    const { multiTimes, transDate, transRange } = booking;
    if (multiTimes === '1') {
      return `${dateToString(transDate)}`;
    }
    return `${dateToString(transRange[0])} ~ ${dateToString(transRange[1])}`;
  };

  /**
   * 產生週期預約轉帳的描述訊息。
   */
  const getCycleDesc = (booking) => {
    const cycleWeekly = ['日', '一', '二', '三', '四', '五', '六'];
    const { cycleTiming } = booking;
    if (booking.cycleMode === 1) {
      return `每周${cycleWeekly[booking.cycleTiming]}`;
    }
    return `每個月${cycleTiming}號`;
  };

  /**
   * 執行轉帳程序，包含進行交易驗證。
   */
  const onConfirm = async () => {
    const auth = await transactionAuth(0x35);
    if (auth.result) {
      // TODO 發動轉帳
      // TODO 顯示轉帳結果
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
          <h3>{getBankName(model.transIn.bank)}</h3>
          <h3>{model.transIn.account}</h3>
        </section>
        <hr />
        <section>
          <InformationList title="轉出帳號" content={model.transOut.account} remark={model.transOut.alias} />

          <InformationList title="時間" content={getTransDate()} />
          {model.mode === 1 && (
          <InformationList
            title="週期"
            content={getCycleDesc(model.booking)}
            remark={model.booking.multiTimes === '*' ? `預計轉帳${model.booking.transTimes}次` : ''}
          />
          )}

          {/* NOTE model 手續費! 還沒轉出，如何顯示？ 9/8 數金：拿掉！ */}
          {/* {model.mode === 0 && <InformationList title="手續費" content="$0" />} */}
          <InformationList title="備註" content={model.memo} />
        </section>
        <hr />
        <section className="transferAction">
          <div className="transferButtonArea">
            <FEIBButton onClick={onConfirm}>確認</FEIBButton>
            <p className="notice">轉帳前多思考，避免被騙更苦惱</p>
          </div>
        </section>
      </TransferWrapper>
    </Layout>
  ) : null;
};

export default TransferConfirm;
