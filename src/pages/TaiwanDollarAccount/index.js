/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

/* Elements */
import Layout from 'components/Layout/Layout';
import AccountOverview from 'components/AccountOverview';
import DepositDetailPanel from 'components/DepositDetailPanel/depositDetailPanel';
import { FEIBInputLabel, FEIBInput, FEIBErrorMessage } from 'components/elements';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { customPopup } from 'utilities/MessageModal';
import { loadFuncParams, startFunc } from 'utilities/BankeePlus';
import { ArrowNextIcon, SwitchIcon } from 'assets/images/icons';
import { getAccountSummary, getDepositBonus, getTransactionDetails, downloadDepositBookCover } from './api';
import TaiwanDollarAccountWrapper from './taiwanDollarAccount.style';

/**
 * C00300 台幣帳戶首頁
 */
const TaiwanDollarAccount = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

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
      const acctData = await getAccountSummary('MC'); // M=台幣主帳戶、C=台幣子帳戶
      model.accounts = Object.assign({}, ...acctData.map((acct) => ({ // Note: 將陣列(Array)轉為字典(Object/HashMap)
        [acct.acctId]: {
          cardInfo: acct,
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
      const accountNo = account.cardInfo.acctId;
      account.panelInfo = await getDepositBonus(accountNo);
      if (accountNo !== getSelectedAccount()) return; // Note: 當卡片已經換掉了，就不需要顯示這份資料。
    }
    setPanelInfo(account.panelInfo);
  };

  /**
   * 更新帳戶交易明細清單
   */
  const updateTransactions = async (account) => {
    setTransactions(null);
    if (account.transactions === null) {
      const request = {
        account: account.cardInfo.acctId,
        currency: 'NTD',
      };
      // 取得帳戶交易明細（三年內的前25筆即可）
      const transData = await getTransactionDetails(request);

      account.transactions = transData.acctTxDtls.slice(0, 10); // 最多只需保留 10筆。
      if (account.transactions.length > 0) {
        account.cardInfo.acctBalx = account.transactions[0].balance; // 更新餘額。
      }

      if (request.account !== getSelectedAccount()) return; // Note: 當卡片已經換掉了，就不需要顯示這份資料。
    }
    setTransactions(account.transactions);
  };

  /**
   * 根據當前帳戶取得交易明細資料及優惠利率數字
   */
  useEffect(async () => {
    // Note: 因為無法解決在非同步模式下，selectedAccount不會變更的問題的暫時解決方案。
    sessionStorage.setItem('selectedAccount', selectedAccount);

    if (selectedAccount) {
      const account = accounts[selectedAccount];
      updateBonusPanel(account); // 取得優惠利率資訊
      updateTransactions(account); // 取得帳戶交易明細（三年內的前25筆即可
    }
  }, [selectedAccount]);
  const getSelectedAccount = () => sessionStorage.getItem('selectedAccount'); // Note: 暫時解決方案。

  // 優存(利率/利息)資訊 顯示模式（true.優惠利率, false.累積利息)
  const [showRate, setShowRate] = useState(true);

  /**
   * 顯示 優存(利率/利息)資訊
   */
  const renderBonusInfoPanel = (data) => {
    if (!data) {
      return (
        // FBI-9 TODO: 顯示載入中...
        <div>FBI-9 TODO: 顯示載入中...</div>
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

  /**
   * 編輯帳戶名稱
   * @param {*} name 原始帳戶名稱
   */
  const showRenameDialog = async (name) => {
    const body = (
      <>
        <FEIBInputLabel>新的帳戶名稱</FEIBInputLabel>
        <FEIBInput defaultValue={name} autoFocus {...register('newName', { required: true })} />
        <FEIBErrorMessage $noSpacing />
      </>
    );
    const onOk = () => {
      console.log('帳戶名稱 : ', name);
      handleSubmit((newName) => {
        // TODO: 因為 register('newName' 無效果，所以拿不回 newName
        console.log('新帳戶名稱 : ', newName);
        // TODO: Call API 變更帳戶名稱。
      });
    };
    await customPopup('帳戶名稱編輯', body, onOk);
  };

  /**
   * 執行指定的單元功能。
   * @param {*} funcCode 功能代碼
   */
  const handleFunctionChange = async (funcCode) => {
    let params = null;
    const model = { accounts, selectedAccount };
    switch (funcCode) {
      case 'taiwanDollarAccountDetails': // 更多明細
        params = accounts[selectedAccount].cardInfo; // 直接提供帳戶摘要資訊，因為一定是從有帳戶資訊的頁面進去。
        break;
      case 'D00100': // 轉帳
      case 'D00300': // 無卡提款
      case 'E00100': // 換匯
        params = model; // 直接提供帳戶摘要資訊，可以減少Call API；但也可以傳 null 要求重載。
        break;
      case 'DownloadDepositBookCover': // 存摺封面下載
        downloadDepositBookCover(selectedAccount); // 預設檔名為「帳號-日期.pdf」，密碼：身分證號碼
        return;
      case 'Rename': // 帳戶名稱編輯
        showRenameDialog(accounts[selectedAccount].cardInfo.acctName);
        return;
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
            { fid: 'DownloadDepositBookCover', title: '存摺封面下載', icon: 'coverDownload' },
            { fid: 'Rename', title: '帳戶名稱編輯', icon: 'edit' },
          ]}
        />

        {/* 顯示 優惠利率資訊面版 */}
        { renderBonusInfoPanel(panelInfo) }

        <DepositDetailPanel
          details={transactions}
          onClick={() => handleFunctionChange('taiwanDollarAccountDetails')}
        />
      </div>
    </Layout>
  );
};

export default TaiwanDollarAccount;
