/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
import { useEffect, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

/* Elements */
import Layout from 'components/Layout/Layout';
import AccountOverview from 'components/AccountOverview/AccountOverview';
import DepositDetailPanel from 'components/DepositDetailPanel/depositDetailPanel';
import { FEIBInputLabel, FEIBInput } from 'components/elements';
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { showCustomPrompt } from 'utilities/MessageModal';
import { getAccountsList, getAccountBonus, updateAccount, getAccountInterest } from 'utilities/CacheData';
import { Func } from 'utilities/FuncID';
import { useNavigation, loadFuncParams } from 'hooks/useNavigation';
import { currencySymbolGenerator } from 'utilities/Generator';
import { getTransactions, setAccountAlias } from './api';
import PageWrapper from './C00500.style';

/**
 * C00500 臺幣交割帳戶首頁
 */
const C00500 = () => {
  const dispatch = useDispatch();
  const { startFunc } = useNavigation();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const { register, unregister, handleSubmit } = useForm();

  const [selectedAccountIdx, setSelectedAccountIdx] = useState();
  const [accounts, setAccounts] = useState();

  // 優存(利率/利息)資訊 顯示模式（true.目前利率, false.累積利息)
  const [showRate, setShowRate] = useState(true);

  const selectedAccount = accounts ? accounts[selectedAccountIdx ?? 0] : null;

  /**
   * 頁面啟動，初始化
  */
  useEffect(() => {
    dispatch(setWaittingVisible(true));

    getAccountsList('S', async (items) => {
      items.forEach((item) => {
        item.balance = item.details[0].balance;
        item.currency = item.details[0].currency;
      });
      setAccounts(items);
      return items;
    }).then(async (items) => {
      await processStartParams(items);
    }).finally(() => dispatch(setWaittingVisible(false)));

    return () => setAccounts(null);
  }, []);

  /**
   * 處理 Function Controller 提供的啟動參數。
   * @param {[*]} accts
   */
  const processStartParams = async (accts) => {
    // startParams: {
    //   defaultAccount: 預設帳號
    // }
    const startParams = await loadFuncParams();
    // 取得 Function Controller 提供的 keepData(model)
    if (startParams && (startParams instanceof Object)) {
      accts.forEach((acct) => {
        if (startParams.txnDetailsObj[acct.accountNo]) acct.txnDetails = startParams.txnDetailsObj[acct.accountNo];
      });
      const index = accts.findIndex((acc) => acc.accountNo === startParams.defaultAccount);
      setSelectedAccountIdx(index);
    } else {
      setSelectedAccountIdx(0);
    }
  };

  /**
   * 下載 優存(利率/利息)資訊
   */
  const loadExtraInfo = async (account) => {
    if (!account.bonus || !account.bonus.loading) {
      account.bonus = { loading: true };
      getAccountBonus(account.accountNo, (info) => {
        account.bonus = info; // info 已經不包含 loading 旗標
        forceUpdate();
      });
    }
  };

  /**
   * 下載利率/利息資訊
   */
  const loadInterest = async (account, index) => {
    if (!account.details[index].loading) {
      const { accountNo, currency } = account;
      account.details[index].loading = true;
      getAccountInterest({ accountNo, currency }, (newDetail) => {
        account.details[index] = newDetail; // newDetail 已經不包含 loading 旗標
        forceUpdate();
      });
    }
  };

  /**
   * 顯示 優存資訊
   */
  const renderBonusInfoPanel = () => {
    if (!selectedAccount) return null;
    const { bonus, currency, details } = selectedAccount;
    const dtlIndex = details.findIndex((dtl) => dtl.currency === currency);

    if (!bonus) loadExtraInfo(selectedAccount); // 下載 優存資訊
    const { freeWithdrawRemain = '-', freeTransferRemain = '-' } = bonus ?? {};

    if (details[dtlIndex] && !('interest' in details[dtlIndex])) loadInterest(selectedAccount, dtlIndex); // 下載 利率/利息資訊
    const { interest = '-', rate = '-' } = details[dtlIndex] ?? {};

    const panelContent = [
      {
        label: '免費跨提/轉',
        value: `${freeWithdrawRemain ?? '-'}/${freeTransferRemain ?? '-'}`,
        onClick: () => showCustomPrompt({
          title: '免費跨提轉',
          message: (
            <p className="txtCenter">
              跨行提款/跨行轉帳手續費優惠次數計算基準:於當月月初第二個日曆日凌晨 00:00:00 起重新計算,並於次月第一個日曆日下午 23:59:59 失效。
            </p>),
          onOk: null,
        }),
      },
      {
        label: showRate ? '目前利率' : '累積利息',
        value: showRate ? `${rate}%` : currencySymbolGenerator(currency, interest),
        iconType: 'switch',
        onClick: () => setShowRate(!showRate),
      },
      { label: '優惠利率額度', value: '0' }, // TODO 暫時固定顯示0
    ];

    return (
      <div className="panel">
        <ThreeColumnInfoPanel content={panelContent} />
      </div>
    );
  };

  /**
   * 更新帳戶交易明細清單。
   * @returns 需有傳回明細清單供顯示。
   */
  const loadTransactions = (account) => {
    const { txnDetails } = account;
    if (!account.isLoadingTxn && !txnDetails) {
      account.isLoadingTxn = true; // 避免因為非同步執行造成的重覆下載
      // 取得帳戶交易明細（三年內的前25筆即可）
      getTransactions(account.accountNo).then((transData) => {
        const details = transData.acctTxDtls.slice(0, 10); // 最多只需保留 10筆。
        account.txnDetails = details;

        // 更新餘額。
        if (transData.acctTxDtls.length > 0) account.balance = details[0].balance;

        delete account.isLoadingTxn; // 載入完成才能清掉旗標！
        updateAccount(account);
        forceUpdate();
      });
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

      const newAccount = { ...selectedAccount };
      updateAccount(newAccount);
    };
    await showCustomPrompt({
      title: '帳戶名稱編輯',
      message: body,
      onOk: handleSubmit(onOk),
    });
  };

  /**
   * 執行指定的單元功能。
   * @param {*} funcCode 功能代碼
   */
  const handleFunctionClick = async (funcCode) => {
    let params = null;

    switch (funcCode) {
      case 'moreTranscations': // 更多明細
        params = {
          ...selectedAccount, // 直接提供帳戶摘要資訊就不用再下載。
          cardColor: 'blue',
        };
        break;

      case Func.D001.id: // 轉帳
        params = { transOut: selectedAccount.accountNo };
        break;

      case Func.E001.id: // 換匯，預設為台轉外
        params = { model: {
          mode: 1,
          outAccount: selectedAccount.accountNo,
          currency: 'USD', // 預設美元
        }};
        break;

      case Func.C008.id: // 匯出存摺
        params = { accountNo: selectedAccount.accountNo };
        break;

      case Func.D008.id: // 預約轉帳查詢/取消
        params = { accountNo: selectedAccount.accountNo };
        break;

      case 'Rename': // 帳戶名稱編輯
        showRenameDialog(selectedAccount.alias);
        return;

      default:
        break;
    }

    const txnDetailsObj = accounts.reduce((acc, cur) => {
      if (cur.txnDetails) acc[cur.accountNo] = cur.txnDetails;
      return acc;
    }, {});

    const keepData = {
      defaultAccount: selectedAccount.accountNo,
      txnDetailsObj,
    };
    startFunc(funcCode, params, keepData);
  };

  /**
   * 頁面輸出
   */
  return (
    <Layout fid={Func.C005} title="證券交割戶">
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
                { fid: Func.D001.id, title: '轉帳' },
                {
                  fid: Func.E001.id,
                  title: '換匯',
                  enabled: selectedAccount.balance > 0,
                },
              ]}
              moreFuncs={[
                { fid: Func.D008.id, title: '預約轉帳查詢/取消', icon: 'reserve' },
                { fid: Func.C008.id, title: '匯出存摺', icon: 'coverDownload' },
                { fid: 'Rename', title: '帳戶名稱編輯', icon: 'edit' },
              ]}
            />

            {/* 顯示 優惠利率資訊面版 */}
            {renderBonusInfoPanel()}

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
export default C00500;
