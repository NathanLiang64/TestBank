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
import { FuncID } from 'utilities/FuncID';
import {
  getTransactions,
  downloadDepositBookCover,
  setAccountAlias,
} from './api';
import PageWrapper from './C00500.style';

/**
 * C00500 台幣交割帳戶首頁
 */
const C00500 = () => {
  const dispatch = useDispatch();
  const { register, unregister, handleSubmit } = useForm();

  const [accounts, setAccounts] = useState();
  const [selectedAccount, setSelectedAccount] = useState();
  const [selectedAccountIdx, setSelectedAccountIdx] = useState(0);
  const [transactions, setTransactions] = useState(new Map());

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
    // NOTE 使用非同步方式更新畫面，一開始會先顯示帳戶基本資料，待取得跨轉等資訊時再更新一次畫面。
    await loadAccountsList('S', setAccounts); // S=台幣交割帳戶
    const startParams = await loadFuncParams(); // Function Controller 提供的參數
    // 取得 Function Controller 提供的 keepData(model)

    if (startParams && (typeof startParams === 'object')) {
      const keepData = startParams;
      setSelectedAccountIdx(keepData.selectedAccountIdx);
    }
  }, []);

  /**
   * 初始化帳戶卡資料載入。
   */
  useEffect(async () => {
    if (!accounts) return;

    dispatch(setWaittingVisible(false));
    if (accounts.length === 0) {
      await showPrompt('您還沒有任何證券交割的存款帳戶，請在系統關閉此功能後，立即申請。', () => closeFunc());
    } else handleAccountChanged(selectedAccountIdx ?? 0);
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
      if (txnDetails.length > 0) {
        setAccounts((prevAccts) => prevAccts.map((prevAcct) => {
          if (prevAcct.accountNo === accountNo) return { ...prevAcct, balance: txnDetails[0].balance };
          return prevAcct;
        }));
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
          cardColor: 'blue',
        };
        break;

      case FuncID.D00100: // 轉帳
        params = { transOut: selectedAccount.accountNo };
        break;

      case FuncID.E00100: // 換匯
        params = { transOut: selectedAccount.accountNo };
        break;

      case 'DownloadCover': // 存摺封面下載
        downloadDepositBookCover(selectedAccount.accountNo); // 預設檔名為「帳號-日期.pdf」，密碼：身分證號碼
        return;

      case 'Rename': // 帳戶名稱編輯
        showRenameDialog(selectedAccount.alias);
        return;

      default:
        break;
    }

    startFunc(funcCode, params, model);
  };

  /**
   * 頁面輸出
   */

  console.log('accounts', accounts);
  return (
    <Layout title="證券交割戶">
      <PageWrapper small>
        {selectedAccount ? (
          <>
            <AccountOverview
              accounts={accounts}
              defaultSlide={selectedAccountIdx}
              onAccountChanged={setSelectedAccountIdx}
              onFunctionClick={handleFunctionClick}
              cardColor="blue"
              funcList={[
                {
                  fid: 'D00100',
                  title: '轉帳',
                  enabled:
                    selectedAccount.transable && selectedAccount.balance > 0,
                  transable: selectedAccount.transable,
                },
                {
                  fid: 'E00100',
                  title: '換匯',
                  enabled: selectedAccount.balance > 0,
                },
              ]}
              moreFuncs={[
                {
                  fid: 'DownloadCover',
                  title: '存摺封面下載',
                  icon: 'coverDownload',
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
export default C00500;
