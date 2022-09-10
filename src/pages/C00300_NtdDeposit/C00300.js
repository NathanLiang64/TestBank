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
import { customPopup, showPrompt } from 'utilities/MessageModal';
import { loadFuncParams, startFunc, closeFunc } from 'utilities/AppScriptProxy';
import { setLocalData } from 'utilities/Generator';
import { AccountListCacheName, getAccountExtraInfo, loadAccountsList } from 'pages/D00100_NtdTransfer/api';
import { ArrowNextIcon, SwitchIcon } from 'assets/images/icons';
import {
  getTransactions,
  downloadDepositBookCover,
  setAccountAlias,
} from './api';
import C00300Wrapper from './C00300.style';

/**
 * C00300 台幣帳戶首頁
 */
const TaiwanDollarAccount = () => {
  const dispatch = useDispatch();
  const { register, unregister, handleSubmit } = useForm();

  const [accounts, setAccounts] = useState();
  const [selectedAccountIdx, setSelectedAccountIdx] = useState();
  const [transactions, setTransactions] = useState(new Map());

  // 優存(利率/利息)資訊 顯示模式（true.優惠利率, false.累積利息)
  const [showRate, setShowRate] = useState(true);

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const startParams = await loadFuncParams(); // Function Controller 提供的參數
    // 取得 Function Controller 提供的 keepDdata(model)
    let keepDdata = null;
    if (startParams && (typeof startParams === 'object')) {
      keepDdata = startParams;
      setAccounts(keepDdata.accounts);
      setSelectedAccountIdx(keepDdata.selectedAccountIdx);
    } else {
      // 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
      // NOTE 使用非同步方式更新畫面，一開始會先顯示帳戶基本資料，待取得跨轉等資訊時再更新一次畫面。
      loadAccountsList('MC', setAccounts); // M=台幣主帳戶、C=台幣子帳戶
      setSelectedAccountIdx(0);
    }
  }, []);

  /**
   * 初始化帳戶卡資料載入。
   */
  useEffect(async () => {
    if (!accounts) return;

    dispatch(setWaittingVisible(false));
    if (accounts.length === 0) {
      await showPrompt('您還沒有任何台幣存款帳戶，請在系統關閉此功能後，立即申請。', () => closeFunc());
    } else handleAccountChanged(0);
  }, [accounts]);

  /**
   * 更新帳戶交易明細清單
   */
  const updateTransactions = async (account) => {
    const { accountNo } = account;
    let txnDetails = transactions.get(accountNo);
    if (!txnDetails) {
      // 取得帳戶交易明細（三年內的前25筆即可）
      const transData = await getTransactions(accountNo);
      txnDetails = transData.acctTxDtls.slice(0, 10); // 最多只需保留 10筆。
      if (transData.length > 0) {
        account.balance = txnDetails[0].balance; // 更新餘額。
      }

      transactions.set(accountNo, txnDetails);
      setTransactions(new Map(transactions)); // 強制更新畫面。
    }
  };

  /**
   * 根據當前帳戶取得交易明細資料及優惠利率數字
   */
  const handleAccountChanged = async (acctIndex) => {
    setSelectedAccountIdx(acctIndex);
    if (!accounts) return; // 頁面初始化時，不需要進來。

    const account = accounts[acctIndex];
    // 若還沒有取得 免費跨轉次數 則立即補上。
    if (!account.freeTransfer) {
      getAccountExtraInfo(account.accountNo).then((info) => {
        accounts[acctIndex] = {
          ...account,
          ...info,
        };
        setLocalData(AccountListCacheName, accounts);
        setAccounts([...accounts]); // 強制更新畫面。
      });
    }
    updateTransactions(account); // 取得帳戶交易明細（三年內的前25筆即可)
  };

  /**
   * 顯示 優存(利率/利息)資訊
   */
  const renderBonusInfoPanel = () => {
    const account = accounts[selectedAccountIdx];
    if (!account) return null;

    const { freeWithdraw, freeTransfer, bonusQuota, bonusRate, interest } = account;
    if (!freeTransfer) {
      return (
        <div style={{ lineHeight: '5.28833rem', textAlign: 'center', marginBottom: '1.6rem' }}>載入中...</div>
      );
    }

    const value1 = bonusRate ? `${bonusRate * 100}%` : '-';
    const value2 = interest ? `$${interest}` : '-';
    return (
        <div className="interestRatePanel">
          <div className="panelItem">
            <h3>免費跨提/轉</h3>
            <p>{`${freeWithdraw}/${freeTransfer}`}</p>
          </div>
          <div className="panelItem" onClick={() => setShowRate(!showRate)}>
            <h3>
              {showRate ? '優惠利率' : '累積利息'}
              <SwitchIcon className="switchIcon" />
            </h3>
            <p>{showRate ? value1 : value2 }</p>
          </div>

          {/* 用 startFunc 執行 depositPlus ，將 model 存入 keepData 返回時就不用再重 Load */}
          <div className="panelItem" onClick={() => handleFunctionClick('depositPlus')}>
            <h3>
              優惠利率額度
              <ArrowNextIcon />
            </h3>
            <p>{bonusQuota}</p>
          </div>
        </div>
    );
  };

  /**
   * 編輯帳戶名稱
   * @param {*} name 原始帳戶名稱
   */
  const showRenameDialog = async (name) => {
    // Note: 因為這個 Dialog 是動態產生的，所以一定要刪掉註冊的元件。
    //       否則，下次註冊將失效，而且持續傳回最後一次的輪入值，而不會改變。
    unregister('newName', { keepDirty: false });

    const body = (
      <>
        <FEIBInputLabel>新的帳戶名稱</FEIBInputLabel>
        <FEIBInput defaultValue={name} autoFocus {...register('newName')} />
        <FEIBErrorMessage $noSpacing />
      </>
    );
    const onOk = (values) => {
      const account = accounts[selectedAccountIdx];
      account.alias = values.newName; // 變更卡片上的帳戶名稱
      setAccountAlias(account.accountNo, account.alias);
      setAccounts([...accounts]);
    };
    await customPopup('帳戶名稱編輯', body, handleSubmit(onOk));
  };

  /**
   * 執行指定的單元功能。
   * @param {*} funcCode 功能代碼
   */
  const handleFunctionClick = async (funcCode) => {
    let params = null;
    const model = { selectedAccountIdx, showRate };
    const account = accounts[selectedAccountIdx];
    switch (funcCode) {
      case 'moreTranscations': // 更多明細
        params = {
          ...account, // 直接提供帳戶摘要資訊就不用再下載。
          cardColor: 'purple',
        };
        break;
      case 'D00100': // 轉帳
      case 'D00300': // 無卡提款
      case 'E00100': // 換匯
        params = model; // 直接提供帳戶摘要資訊，可以減少Call API；但也可以傳 null 要求重載。
        break;
      case 'DownloadDepositBookCover': // 存摺封面下載
        downloadDepositBookCover(account.accountNo); // 預設檔名為「帳號-日期.pdf」，密碼：身分證號碼
        return;
      case 'Rename': // 帳戶名稱編輯
        showRenameDialog(account.alias);
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
  return accounts ? (
    <Layout title="台幣活存">
      <C00300Wrapper small>
        <AccountOverview
          accounts={accounts}
          onAccountChanged={handleAccountChanged}
          onFunctionClick={handleFunctionClick}
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
        { renderBonusInfoPanel() }

        <DepositDetailPanel
          details={transactions.get(accounts[selectedAccountIdx]?.accountNo)}
          onMoreFuncClick={() => handleFunctionClick('moreTranscations')}
        />
      </C00300Wrapper>
    </Layout>
  ) : null;
};

export default TaiwanDollarAccount;
