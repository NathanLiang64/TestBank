/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* Elements */
import Layout from 'components/Layout/Layout';
import AccountOverview from 'components/AccountOverview';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { loadFuncParams } from 'utilities/BankeePlus';
import { stringDateCodeFormatter } from 'utilities/Generator';
import { getAccountSummary, getDepositBonus, getTransactionDetails } from './api';
import { setAccounts, setSelectedAccount } from './ModelReducer';

/**
 * C00300 台幣帳戶首頁
 */
const TaiwanDollarAccount = () => {
  const model = useSelector((state) => state.ntdAccountSummaryReducer);
  const selectedAccount = useSelector((state) => state.ntdAccountSummaryReducer.selectedAccount);

  const dispatch = useDispatch();

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    let { accounts } = model;
    if (!accounts) {
      // 首次加載時取得用戶所有帳號
      const acctData = await getAccountSummary({ CCY: 'TWD' }); // TODO：取得本人的所有台幣的存款帳戶摘要資訊
      accounts = acctData.map((acct) => ({
        cardInfo: acct,
        // 以下屬性在 selectedAccount 變更時取得。
        panelInfo: null,
        transactions: null,
      }));
      console.log(accounts);

      dispatch(setAccounts(accounts));
    }

    // 以啟動參數(台幣帳號)為預設值；若沒有設，則以第一個帳號為預設值。
    const startParams = loadFuncParams(); // Function Controller 提供的參數
    if (startParams || accounts.length > 0) {
      const accountNo = startParams ? startParams.defaultAccount : accounts[0].cardInfo.acctId;
      await selectedAccountChange(accounts, accountNo);
    }

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 根據當前帳戶取得交易明細資料及優惠利率數字
   */
  const selectedAccountChange = async (accounts, accountNo) => {
    const index = accounts.findIndex((acct) => acct.cardInfo.acctId === accountNo);
    const account = accounts[index];

    // 取得優惠利率資訊
    if (account.panelInfo === null) {
      account.panelInfo = await getDepositBonus({ account: accountNo });
    }

    // 取得帳戶交易明細（三年內的前25筆即可）
    if (account.transactions === null) {
      const today = new Date();
      const beginDay = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
      const requestData = {
        account: accountNo,
        startDate: stringDateCodeFormatter(beginDay), // '20210301',
        endDate: stringDateCodeFormatter(today), // '20220531',
      };
      const transData = await getTransactionDetails(requestData);

      account.transactions = transData;
      dispatch(setAccounts(accounts)); // 更新 Reducer
    }

    dispatch(setSelectedAccount(account));
  };

  /**
   * 當使用者滑動卡片時的事件處理。
   */
  const handleChangeAccount = async (swiper) => {
    const account = model.accounts[swiper.activeIndex];
    await selectedAccountChange(model.accounts, account.cardInfo.acctId);
  };

  /**
   * 頁面輸出
   */
  console.log(model, selectedAccount);
  return selectedAccount ? (
    <Layout title="台幣活存">
      <AccountOverview
        accounts={model.accounts}
        onAccountChange={handleChangeAccount}
        detailsLink="/taiwanDollarAccountDetails" // TODO: 應改為 funcID
        cardColor="purple"
        funcList={[
          { fid: 'D00100', title: '轉帳', params: { defaultAccount: selectedAccount.cardInfo.acctId } },
          { fid: 'D00300', title: '無卡提款', params: { defaultAccount: selectedAccount.cardInfo.acctId } },
        ]}
        moreFuncs={[
          { fid: null, title: '定存', icon: 'fixedDeposit' },
          { fid: 'E00100', title: '換匯', params: { defaultAccount: selectedAccount.cardInfo.acctId }, icon: 'exchange' },
          { fid: null, title: '存摺封面下載', icon: 'coverDownload' },
          // { title: '存摺封面下載', path: 'http://114.32.27.40:8080/test/downloadPDF', icon: 'system_update' },
        ]}
        panelInfo={selectedAccount.panelInfo}
        details={selectedAccount.transactions?.acctTxDtls}
      />
    </Layout>
  ) : <div />;
};

export default TaiwanDollarAccount;
