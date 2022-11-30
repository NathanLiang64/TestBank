/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

/* Elements */
import Layout from 'components/Layout/Layout';
import AccountOverview from 'components/AccountOverview/AccountOverview';
import DepositDetailPanel from 'components/DepositDetailPanel/depositDetailPanel';
import { FEIBInputLabel, FEIBInput } from 'components/elements';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { customPopup, showPrompt } from 'utilities/MessageModal';
import { loadFuncParams, startFunc, closeFunc } from 'utilities/AppScriptProxy';
import { setLocalData } from 'utilities/Generator';
import { AccountListCacheName, getAccountExtraInfo, loadAccountsList } from 'pages/D00100_NtdTransfer/api';
import {
  getTransactions,
  setAccountAlias,
  setMainCurrency,
} from './api';
import PageWrapper from './C00400.style';

/**
 * C00400 外幣帳戶首頁
 */
const C00400 = () => {
  const dispatch = useDispatch();
  const { register, unregister, handleSubmit } = useForm();

  const [accounts, setAccounts] = useState();
  const [selectedAccount, setSelectedAccount] = useState();
  const [selectedAccountIdx, setSelectedAccountIdx] = useState();
  const [transactions, setTransactions] = useState(new Map());

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
    // NOTE 使用非同步方式更新畫面，一開始會先顯示帳戶基本資料，待取得跨轉等資訊時再更新一次畫面。
    loadAccountsList('F', setAccounts); // F=外幣帳戶

    const startParams = await loadFuncParams(); // Function Controller 提供的參數
    // 取得 Function Controller 提供的 keepData(model)
    let keepData = null;
    if (startParams && (typeof startParams === 'object')) {
      keepData = startParams;
      setSelectedAccountIdx(keepData.selectedAccountIdx);
    } else {
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
      await showPrompt('您還沒有任何外幣存款帳戶，請在系統關閉此功能後，立即申請。', () => closeFunc());
    } else handleAccountChanged(selectedAccountIdx ?? 0);
  }, [accounts]);

  /**
   * 更新帳戶交易明細清單
   */
  const updateTransactions = async (account) => {
    const { accountNo, currency } = account;
    let txnDetails = transactions.get(accountNo);
    if (!txnDetails) {
      // 取得帳戶交易明細（三年內的前25筆即可）
      const transData = await getTransactions(accountNo, currency);
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
    if (!accounts || !accounts.length) return; // 頁面初始化時，不需要進來。

    const account = accounts[acctIndex];
    updateTransactions(account); // 取得帳戶交易明細（三年內的前25筆即可)
    setSelectedAccount(account);
  };
  useEffect(() => { handleAccountChanged(selectedAccountIdx); }, [selectedAccountIdx]);
  useEffect(() => { setLocalData(AccountListCacheName, accounts); }, [accounts]);

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
        <FEIBInput {...register('newName')} autoFocus
          inputProps={{ maxLength: 10, placeholder: '請設定此帳戶的專屬名稱', defaultValue: name, autoComplete: 'off' }}
        />
      </>
    );
    const onOk = (values) => {
      selectedAccount.alias = values.newName; // 變更卡片上的帳戶名稱
      setAccountAlias(selectedAccount.accountNo, selectedAccount.alias);
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
    const model = { selectedAccountIdx };
    switch (funcCode) {
      case 'moreTranscations': // 更多明細
        params = {
          ...selectedAccount, // 直接提供帳戶摘要資訊就不用再下載。
          cardColor: 'orange',
        };
        break;

      case 'foreignCurrencyTransfer': // 轉帳
      case 'exchange': // 換匯
        params = model; // 直接提供帳戶摘要資訊，可以減少Call API；但也可以傳 null 要求重載。
        break;

      case 'setMainAccount': // 設定為主要外幣帳戶
        // 將目前帳戶 設定為主要外幣帳戶
        setMainCurrency(selectedAccount.accountNo, selectedAccount.currency);
        return;

      case 'foreignCurrencyPriceSetting': // 外幣到價通知
        break;

      case 'Rename': // 帳戶名稱編輯
        showRenameDialog(selectedAccount.alias);
        return;

      case 'masterCardXB': // MasterCard Send Cross Border
      default:
        // TODO：未完成
        return;
    }

    startFunc(funcCode, params, model);
  };

  /**
   * 頁面輸出
   */

  return (
    <Layout title="外幣活存">
      <PageWrapper small>
        {selectedAccount ? (
          <>
            <AccountOverview
              accounts={accounts}
              defaultSlide={selectedAccountIdx}
              onAccountChanged={setSelectedAccountIdx}
              onFunctionClick={handleFunctionClick}
              cardColor="orange"
              funcList={[
                {
                  fid: 'foreignCurrencyTransfer',
                  title: '轉帳',
                  enabled:
                    selectedAccount.transable && selectedAccount.balance > 0,
                },
                {
                  fid: 'exchange',
                  title: '換匯',
                  enabled: selectedAccount.balance > 0,
                },
              ]}
              moreFuncs={[
                // { fid: 'masterCardXB', title: 'MasterCard Send Cross Border', icon: 'temp' },
                {
                  fid: 'setMainAccount',
                  title: '設定為主要外幣帳戶',
                  icon: 'temp',
                },
                {
                  // fid 需要改成 foreignCurrencyPriceSetting 的 FuncID
                  fid: 'foreignCurrencyPriceSetting',
                  title: '外幣到價通知',
                  icon: 'foreignCurrencyPriceSetting',
                },
                { fid: 'Rename', title: '帳戶名稱編輯', icon: 'edit' },
              ]}
            />

            <DepositDetailPanel
              details={transactions.get(selectedAccount.accountNo)}
              onMoreFuncClick={() => handleFunctionClick('moreTranscations')}
            />
          </>
        ) : null}
      </PageWrapper>
    </Layout>
  );
};

export default C00400;
