/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
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
import { ArrowNextIcon, SwitchIcon } from 'assets/images/icons';
import { getAccountSummary, getDepositBonus, getTransactionDetails } from './api';
import TaiwanDollarAccountWrapper from './taiwanDollarAccount.style';

/**
 * C00300 台幣帳戶首頁
 */
const TaiwanDollarAccount = () => {
  const dispatch = useDispatch();

  const [accounts, setAccounts] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [panelInfo, setPanelInfo] = useState(null);
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

    // 首次加載時取得用戶所有台幣的存款帳戶摘要資訊
    if (!model.accounts) {
      const acctData = await getAccountSummary({ AcctType: 'MC' }); // M=台幣主帳戶、C=台幣子帳戶
      model.accounts = Object.assign({}, ...acctData.map((acct) => ({ // Note: 將陣列(Array)轉為字典(Object/HashMap)
        [acct.acctId]: {
          cardInfo: acct, // TODO: 有帳務異動後，就要重載
          // 以下屬性在 selectedAccount 變更時取得。
          panelInfo: null,
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
   * 更新優惠利率資訊
   */
  const updateBonusPanel = async (account) => {
    setPanelInfo(null);
    if (account.panelInfo === null) {
      const request = { account: account.cardInfo.acctId };
      account.panelInfo = await getDepositBonus(request);
      if (request.account !== getSelectedAccount()) return; // Note: 當卡片已經換掉了，就不需要顯示這份資料。
    }
    setPanelInfo(account.panelInfo);
  };

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
      updateBonusPanel(account); // 取得優惠利率資訊
      updateTransactions(account); // 取得帳戶交易明細（三年內的前25筆即可
    }
  }, [selectedAccount]);
  const getSelectedAccount = () => sessionStorage.getItem('selectedAccount'); // TODO: 暫時解決方案。

  // 優存(利率/利息)資訊 顯示模式（true.優惠利率, false.累積利息)
  const [showRate, setShowRate] = useState(true);

  /**
   * 顯示 優存(利率/利息)資訊
   */
  const renderBonusInfoPanel = (data) => {
    if (!data) {
      return (
        <div>TODO: 顯示載入中...</div>
      );
    }

    const { freeWithdrawal, freeTransfer, bonusQuota } = data;
    const value1 = data.bonusRate ? `${data.bonusRate * 100}%` : '-';
    const value2 = data.interest ? `$${data.interest}` : '-';
    return (
      <TaiwanDollarAccountWrapper>
        <div className="interestRatePanel">
          <div className="panelItem">
            <h3>免費跨提/轉</h3>
            <p>
              {freeWithdrawal}
              /
              {freeTransfer}
            </p>
          </div>
          <div className="panelItem" onClick={() => setShowRate(!showRate)}>
            <h3>
              {showRate ? '優惠利率' : '累積利息'}
              <SwitchIcon className="switchIcon" />
            </h3>
            <p>{showRate ? value1 : value2 }</p>
          </div>

          {/* 用 startFunc 執行 depositPlus ，將 model 存入 keepData 返回時就不用再重 Load */}
          <div className="panelItem" onClick={() => handleFunctionChange('depositPlus')}>
            <h3>
              優惠利率額度
              <ArrowNextIcon />
            </h3>
            <p>{bonusQuota}</p>
          </div>
        </div>
      </TaiwanDollarAccountWrapper>
    );
  };

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
      case 'D00100': // 轉帳
      case 'D00300': // 無卡提款
      case 'E00100': // 換匯
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
    <Layout title="台幣活存">
      <div>
        <AccountOverview
          accounts={Object.values(accounts ?? [])}
          onAccountChange={handleChangeAccount}
          onFunctionChange={handleFunctionChange}
          cardColor="purple"
          funcList={[
            { fid: 'D00100', title: '轉帳' },
            { fid: 'D00300', title: '無卡提款' },
          ]}
          moreFuncs={[
            { fid: null, title: '定存', icon: 'fixedDeposit' },
            { fid: 'E00100', title: '換匯', icon: 'exchange' },
            { fid: null, title: '存摺封面下載', icon: 'coverDownload' },
            // { title: '存摺封面下載', path: 'http://114.32.27.40:8080/test/downloadPDF', icon: 'system_update' },
          ]}
        />

        {/* 顯示 優惠利率資訊面版 */}
        { renderBonusInfoPanel(panelInfo) }

        <DepositDetailPanel
          details={transactions}
          detailsLink="/taiwanDollarAccountDetails" // TODO: 應改為 funcID
        />
      </div>
    </Layout>
  );
};

export default TaiwanDollarAccount;
