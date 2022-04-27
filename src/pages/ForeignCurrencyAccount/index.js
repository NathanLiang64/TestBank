/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

/* Elements */
import Layout from 'components/Layout/Layout';
import AccountOverview from 'components/AccountOverview';
import DepositDetailPanel from 'components/DepositDetailPanel/depositDetailPanel';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { loadFuncParams, startFunc } from 'utilities/BankeePlus';
import { stringDateCodeFormatter } from 'utilities/Generator';
import { getAccountSummary, getTransactionDetails } from './api';

const ForeignCurrencyAccount = () => {
  const dispatch = useDispatch();

  const [accounts, setAccounts] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState(null);

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 以啟動參數(台幣帳號)為預設值；若沒有設，則以第一個帳號為預設值。
    const model = loadFuncParams() ?? { // Function Controller 提供的參數
      accounts: null,
      selectedAccount: null,
    };

    // 首次加載時取得用戶所有外幣的存款帳戶摘要資訊
    if (!model.accounts) {
      const acctData = await getAccountSummary({ AcctType: 'F' }); // F=外幣
      model.accounts = Object.assign({}, ...acctData.map((acct) => ({ // Note: 將陣列(Array)轉為字典(Object/HashMap)
        [acct.acctId]: {
          cardInfo: acct, // TODO: 有帳務異動後，就要重載
          // 以下屬性在 selectedAccount 變更時取得。
          transactions: null,
        },
      })));
    }

    // 預設顯示的帳號。
    if (!model.selectedAccount) model.selectedAccount = Object.values(model.accounts)[0].cardInfo.acctId;

    setAccounts(model.accounts);
    setSelectedAccount(model.selectedAccount);

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 更新帳戶交易明細清單
   */
  const updateTransactions = async (account) => {
    setTransactions(null);
    if (account.transactions === null) {
      const today = new Date();
      const beginDay = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
      const request = {
        account: account.cardInfo.acctId,
        startDate: stringDateCodeFormatter(beginDay), // 例：'20210301',
        endDate: stringDateCodeFormatter(today), // 例：'20220531',
      };
      // 取得帳戶交易明細（三年內的前25筆即可）
      const transData = await getTransactionDetails(request);

      account.transactions = transData.acctTxDtls.slice(0, 10); // 最多只需保留 10筆。
      if (request.account !== getSelectedAccount()) return; // Note: 當卡片已經換掉了，就不需要顯示這份資料。
    }
    setTransactions(account.transactions);
  };

  /**
   * 根據當前帳戶取得交易明細資料及優惠利率數字
   */
  useEffect(async () => {
    // TODO: 因為無法解決在非同步模式下，selectedAccount不會變更的問題的暫時解決方案。
    sessionStorage.setItem('selectedAccount', selectedAccount);

    if (selectedAccount) {
      const account = accounts[selectedAccount];
      updateTransactions(account); // 取得帳戶交易明細（三年內的前25筆即可
    }
  }, [selectedAccount]);
  const getSelectedAccount = () => sessionStorage.getItem('selectedAccount'); // TODO: 暫時解決方案。

  /**
   * 當使用者滑動卡片時的事件處理。
   */
  const handleChangeAccount = async (swiper) => {
    const account = Object.values(accounts)[swiper.activeIndex];
    setSelectedAccount(account.cardInfo.acctId);
  };

  const handleFunctionChange = async (funcCode) => {
    let params = null;
    const model = { accounts, selectedAccount };
    switch (funcCode) {
      case 'foreignCurrencyTransfer': // 轉帳
      case 'exchange': // 換匯
        params = { defaultAccount: selectedAccount };
        break;
      case 'depositPlus':
      default:
        break;
    }

    startFunc(funcCode, params, model);
  };

  /**
   * 頁面輸出
   */
  return (
    <Layout title="外幣活存">
      <div>
        {/* TODO：外幣有小數位數的問題 */}
        <AccountOverview
          accounts={Object.values(accounts ?? [])}
          onAccountChange={handleChangeAccount}
          onFunctionChange={handleFunctionChange}
          cardColor="blue"
          funcList={[
            { fid: 'foreignCurrencyTransfer', title: '轉帳' },
            { fid: 'exchange', title: '換匯' },
          ]}
          moreFuncs={[
            { fid: null, title: 'MasterCard Send Cross Border', icon: 'temp' },
            { fid: null, title: '設定為主要外幣帳戶', icon: 'temp' },
          ]}
        />

        <DepositDetailPanel
          details={transactions}
          detailsLink="/foreignCurrencyAccountDetails" // TODO: 應改為 funcID
        />
      </div>
    </Layout>
  );
};

export default ForeignCurrencyAccount;
