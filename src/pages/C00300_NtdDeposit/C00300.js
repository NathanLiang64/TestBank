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
import { ArrowNextIcon, SwitchIcon } from 'assets/images/icons';
import {
  getAccountSummary,
  getDepositBonus,
  getTransactions,
  downloadDepositBookCover,
  setAccountAlias,
} from './api';
import InterestRatePanelWrapper from './C00300.style';

/**
 * C00300 台幣帳戶首頁
 */
const TaiwanDollarAccount = () => {
  const dispatch = useDispatch();
  const { register, unregister, handleSubmit } = useForm();

  const [accounts, setAccounts] = useState(null);
  const [selectedAccountIdx, setSelectedAccountIdx] = useState(-1);
  const [panelInfo, setPanelInfo] = useState(null);
  const [transactions, setTransactions] = useState(null);

  // 優存(利率/利息)資訊 顯示模式（true.優惠利率, false.累積利息)
  const [showRate, setShowRate] = useState(true);
  const getSelectedAccount = () => accounts[selectedAccountIdx].cardInfo.acctId;

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const startParams = loadFuncParams(); // Function Controller 提供的參數
    // 取得 Function Controller 提供的 keepDdata(model)
    let model;
    if (startParams && (typeof startParams === 'object')) {
      model = startParams;
    } else {
      model = {
        accounts: null, // 所有帳戶資料暫存
        selectedAccountIdx: null, // 目前使用的帳戶索引
      };
    }

    // 首次加載時取得用戶所有外幣的存款帳戶摘要資訊
    if (!model.accounts) {
      const acctData = await getAccountSummary('MC'); // M=台幣主帳戶、C=台幣子帳戶
      if (!acctData?.length) {
        showPrompt('您還沒有任何台幣存款帳戶，請在系統關閉此功能後，立即申請。', () => closeFunc());
        return;
      }
      model.accounts = acctData.map((acct) => ({ // Note: 將陣列(Array)轉為字典(Object/HashMap)
        cardInfo: acct,
        panelInfo: null, // 此屬性在 selectedAccountIdx 變更時取得。
        transactions: null, // 此屬性在 selectedAccountIdx 變更時取得。
      }));
      model.selectedAccountIdx = 0; // 以第一個帳號為預設值。
    }

    setAccounts(model.accounts);
    setSelectedAccountIdx(model.selectedAccountIdx);

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
      // 取得帳戶交易明細（三年內的前25筆即可）
      const accountNo = account.cardInfo.acctId;
      const transData = await getTransactions(accountNo);

      account.transactions = transData.acctTxDtls.slice(0, 10); // 最多只需保留 10筆。
      if (account.transactions.length > 0) {
        account.cardInfo.acctBalx = account.transactions[0].balance; // 更新餘額。
      }

      if (accountNo !== getSelectedAccount()) return; // Note: 當卡片已經換掉了，就不需要顯示這份資料。
    }
    setTransactions(account.transactions);
  };

  /**
   * 根據當前帳戶取得交易明細資料及優惠利率數字
   */
  useEffect(async () => {
    if (selectedAccountIdx >= 0) {
      const account = accounts[selectedAccountIdx];
      updateBonusPanel(account); // 取得優惠利率資訊
      updateTransactions(account); // 取得帳戶交易明細（三年內的前25筆即可
    }
  }, [selectedAccountIdx]);

  /**
   * 顯示 優存(利率/利息)資訊
   */
  const renderBonusInfoPanel = (data) => {
    if (!data) {
      return (
        <div style={{ lineHeight: '5.28833rem', textAlign: 'center', marginBottom: '1.6rem' }}>載入中...</div>
      );
    }

    const { freeWithdrawal, freeTransfer, bonusQuota } = data;
    const value1 = data.bonusRate ? `${data.bonusRate * 100}%` : '-';
    const value2 = data.interest ? `$${data.interest}` : '-';
    return (
      <InterestRatePanelWrapper>
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
      </InterestRatePanelWrapper>
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
      const account = accounts[selectedAccountIdx].cardInfo;
      account.acctName = values.newName; // 變更卡片上的帳戶名稱
      setAccountAlias(account.acctId, account.acctName);
      setAccounts({ ...accounts });
    };
    await customPopup('帳戶名稱編輯', body, handleSubmit(onOk));
  };

  /**
   * 執行指定的單元功能。
   * @param {*} funcCode 功能代碼
   */
  const handleFunctionChange = async (funcCode) => {
    let params = null;
    const model = { accounts, selectedAccountIdx };
    const account = accounts[selectedAccountIdx];
    switch (funcCode) {
      case 'moreTranscations': // 更多明細
        params = {
          ...account.cardInfo, // 直接提供帳戶摘要資訊，因為一定是從有帳戶資訊的頁面進去。
          // cardTitle: '存款帳戶交易明細',
          cardColor: 'purple',
        };
        break;
      case 'D00100': // 轉帳
      case 'D00300': // 無卡提款
      case 'E00100': // 換匯
        params = model; // 直接提供帳戶摘要資訊，可以減少Call API；但也可以傳 null 要求重載。
        break;
      case 'DownloadDepositBookCover': // 存摺封面下載
        downloadDepositBookCover(account.cardInfo.acctId); // 預設檔名為「帳號-日期.pdf」，密碼：身分證號碼
        return;
      case 'Rename': // 帳戶名稱編輯
        showRenameDialog(account.cardInfo.acctName);
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
          onAccountChange={(swiper) => setSelectedAccountIdx(swiper.activeIndex)}
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
          onClick={() => handleFunctionChange('moreTranscations')}
        />
      </div>
    </Layout>
  );
};

export default TaiwanDollarAccount;
