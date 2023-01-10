/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
import { useEffect, useState, useReducer } from 'react';
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
import { loadFuncParams } from 'utilities/AppScriptProxy';
import { getAccountsList, updateAccount } from 'utilities/CacheData';
import { FuncID } from 'utilities/FuncID';
import { useNavigation } from 'hooks/useNavigation';
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
  const {startFunc, closeFunc} = useNavigation();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const { register, unregister, handleSubmit } = useForm();

  const [accounts, setAccounts] = useState();
  const [selectedAccountIdx, setSelectedAccountIdx] = useState();

  const selectedAccount = accounts ? accounts[selectedAccountIdx ?? 0] : null;

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
    // NOTE 使用非同步方式更新畫面，一開始會先顯示帳戶基本資料，待取得跨轉等資訊時再更新一次畫面。
    getAccountsList('F', async (items) => { // M=臺幣主帳戶、C=臺幣子帳戶
      if (items.length === 0) {
        await showPrompt('您還沒有任何外幣存款帳戶，請在系統關閉此功能後，立即申請。', () => closeFunc());
      } else {
        setAccounts(items);
        await processStartParams(items);
        dispatch(setWaittingVisible(false));
      }
    });
  }, []);

  /**
   * 處理 Function Controller 提供的啟動參數。
   * @param {[*]} accts
   */
  const processStartParams = async (accts) => {
    /* 所有外幣帳戶只有一個帳號，使用幣別區分index */
    // startParams: {
    //   defaultCurrency: 預設幣別
    // }
    const startParams = await loadFuncParams();
    // 取得 Function Controller 提供的 keepData(model)
    if (startParams && (startParams instanceof Object)) {
      const index = accts.findIndex((acc) => acc.currency === startParams.defaultCurrency);
      setSelectedAccountIdx(index);
    } else {
      setSelectedAccountIdx(0);
    }
  };

  /**
   * 更新帳戶交易明細清單。
   * @returns 需有傳回明細清單供顯示。
   */
  const loadTransactions = (account) => {
    const { txnDetails } = account;
    if (!account.isLoadingTxn) {
      account.isLoadingTxn = true; // 避免因為非同步執行造成的重覆下載
      if (!txnDetails) {
        // 取得帳戶交易明細（三年內的前25筆即可）
        getTransactions(account.accountNo, account.currency).then((transData) => {
          const details = transData.acctTxDtls.slice(0, 10); // 最多只需保留 10筆。
          account.txnDetails = details;

          // 更新餘額。
          if (transData.length > 0) account.balance = details[0].balance;

          delete account.isLoadingTxn; // 載入完成才能清掉旗標！
          forceUpdate();
        });
      }
    }
    return txnDetails;
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
        <FEIBInput
          {...register('newName')}
          autoFocus
          inputProps={{ maxLength: 10, placeholder: '請設定此帳戶的專屬名稱', defaultValue: name, autoComplete: 'off' }}
        />
      </>
    );
    const onOk = (values) => {
      selectedAccount.alias = values.newName; // 變更卡片上的帳戶名稱
      setAccountAlias(selectedAccount.accountNo, selectedAccount.alias);
      forceUpdate();

      // NOTE 明細資料不需要存入Cache，下次進入C00400時才會更新。
      const newAccount = {...selectedAccount};
      delete newAccount.isLoadingTxn;
      delete newAccount.txnDetails;
      updateAccount(newAccount);

      // 其他同帳號、不同幣別的帳戶名稱也要一併修改
      accounts.forEach((account) => {
        if (account.accountNo === selectedAccount.accountNo) {
          account.alias = values.newName;
          updateAccount(account);
        }
      });
    };
    await customPopup('帳戶名稱編輯', body, handleSubmit(onOk));
  };

  /**
   * 執行指定的單元功能。
   * @param {*} funcCode 功能代碼
   */
  const handleFunctionClick = async (funcCode) => {
    let params = null;
    const keepData = { defaultAccount: selectedAccount.accountNo };
    switch (funcCode) {
      case 'moreTranscations': // 更多明細
        params = {
          ...selectedAccount, // 直接提供帳戶摘要資訊就不用再下載。
          cardColor: 'orange',
        };
        break;

      case 'foreignCurrencyTransfer': // 轉帳
      case FuncID.E00100_換匯: // 換匯
        params = keepData; // TODO 直接提供帳戶摘要資訊，可以減少Call API；但也可以傳 null 要求重載。
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

    startFunc(funcCode, params, keepData);
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
                  fid: FuncID.E00100_換匯,
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
                  fid: 'foreignCurrencyPriceSetting',
                  title: '外幣到價通知設定',
                  icon: 'foreignCurrencyPriceSetting',
                },
                { fid: 'Rename', title: '帳戶名稱編輯', icon: 'edit' },
              ]}
            />

            <DepositDetailPanel
              details={loadTransactions(selectedAccount)}
              onMoreFuncClick={() => handleFunctionClick('moreTranscations')}
            />
          </>
        ) : null}
      </PageWrapper>
    </Layout>
  );
};

export default C00400;
