/* eslint-disable no-nested-ternary */
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
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { customPopup } from 'utilities/MessageModal';
import { getAccountsList, updateAccount, getAccountInterest } from 'utilities/CacheData';
import { Func } from 'utilities/FuncID';
import { useNavigation, loadFuncParams } from 'hooks/useNavigation';
import { currencySymbolGenerator } from 'utilities/Generator';
import {
  getExchangeRateInfo,
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
  const { startFunc } = useNavigation();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const { register, unregister, handleSubmit } = useForm();

  const [accounts, setAccounts] = useState();
  const [selectedAccountIdx, setSelectedAccountIdx] = useState();
  // 參考買/賣價顯示模式 (true.買價, false.賣價)
  const [showBuyPrice, setShowBuyPrice] = useState(true);
  // 利率顯示模式 (true.目前利率, false.累積利息)
  const [showRate, setShowRate] = useState(true);
  const [exRateList, setExRateList] = useState();
  // 匯率列表

  const selectedAccount = accounts ? accounts[selectedAccountIdx ?? 0] : null;

  /**
   * 頁面啟動，初始化
   */
  useEffect(() => {
    dispatch(setWaittingVisible(true));

    // 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
    // NOTE 使用非同步方式更新畫面，一開始會先顯示帳戶基本資料，待取得跨轉等資訊時再更新一次畫面。
    const api1 = getAccountsList('F', async (accts) => {
      // M=臺幣主帳戶、C=臺幣子帳戶
      const foreignAcct = accts[0];
      const {details, ...restDetails} = foreignAcct;
      const flattenAccts = details.map((detail) => ({
        ...restDetails,
        balance: detail.balance,
        currency: detail.currency,
        details: {...detail} }));

      setAccounts(flattenAccts);
      return flattenAccts;
    });

    const api2 = getExchangeRateInfo().then((lists) => {
      setExRateList(lists);
    });

    Promise.all([api1, api2]).then(async (values) => {
      await processStartParams(values[0]);
    }).finally(() => dispatch(setWaittingVisible(false)));
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
    if (startParams && startParams instanceof Object) {
      const index = accts.findIndex((acc) => acc.currency === startParams.defaultCurrency);
      accts.forEach((acct) => {
        if (startParams.txnDetailsObj[acct.currency]) acct.txnDetails = startParams.txnDetailsObj[acct.currency];
      });
      setSelectedAccountIdx(index);
    } else {
      setSelectedAccountIdx(0);
    }
    if (selectedAccount) delete selectedAccount.isLoadingTxn; // 避免因載入中中斷，而永遠無法再重載明細。
  };

  /**
   * 下載利率/利息資訊
   */
  const loadInterest = async (account) => {
    if (!account.details.loading) {
      const { accountNo, currency} = account;
      account.details.loading = true;
      getAccountInterest({accountNo, currency}, (newDetail) => {
        account.details = newDetail; // newDetail 已經不包含 loading 旗標
        forceUpdate();
      });
    }
  };

  /**
   * 顯示 優存(利率/利息)資訊
   */
  const renderBonusInfoPanel = () => {
    if (!selectedAccount) return null;
    const { currency, details } = selectedAccount;

    const exRateItem = exRateList?.find(({ ccycd }) => currency === ccycd);
    const brate = exRateItem?.brate ?? '-';
    const srate = exRateItem?.srate ?? '-';

    if (!('interest' in details)) loadInterest(selectedAccount); // 下載 利率/利息資訊
    const { interest = '-', rate = '-' } = details;

    const panelContent = [
      {
        label: showBuyPrice ? '參考買價' : '參考賣價',
        value: showBuyPrice ? srate : brate,
        iconType: 'switch',
        onClick: () => setShowBuyPrice(!showBuyPrice),
      },
      {
        label: showRate ? '目前利率' : '累積利息',
        value: showRate ? `${rate}%` : currencySymbolGenerator(currency, interest),
        iconType: 'switch',
        onClick: () => setShowRate(!showRate),
      },
      { label: '優惠利率額度', value: '0' }, // 依目前需求先暫時 hardcode 顯示為 0
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
  useEffect(() => {
    const account = selectedAccount;
    if (account && !account.txnDetails) {
      // 取得帳戶交易明細（三年內的前25筆即可）
      getTransactions(account.accountNo, account.currency).then((transData) => {
        const details = transData.acctTxDtls.slice(0, 10); // 最多只需保留 10筆。
        account.txnDetails = details;

        // 更新餘額。
        if (transData.acctTxDtls.length > 0) { account.balance = details[0].balance; }

        forceUpdate();
      });
    }
  }, [selectedAccountIdx]);

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

    switch (funcCode) {
      case 'moreTranscations': // 更多明細
        params = {
          ...selectedAccount, // 直接提供帳戶摘要資訊就不用再下載。
          cardColor: 'orange',
        };
        break;

      case Func.D007.id: // 轉帳
        params = { currency: selectedAccount.currency }; // TODO 直接提供帳戶摘要資訊，可以減少Call API；但也可以傳 null 要求重載。
        break;
      case Func.E001.id: // 換匯
        params = { model: {
          mode: 2,
          outAccount: selectedAccount.accountNo,
          currency: selectedAccount.currency,
        }};
        break;

      case 'setMainAccount': // 設定為主要外幣帳戶
        // 將目前帳戶 設定為主要外幣帳戶
        setMainCurrency(selectedAccount.accountNo, selectedAccount.currency);
        return;

      case Func.E004.id: // 外幣到價通知
        break;

      case 'Rename': // 帳戶名稱編輯
        showRenameDialog(selectedAccount.alias);
        return;

      case 'masterCardXB': // MasterCard Send Cross Border
      default:
        // TODO：未完成
        return;
    }

    const txnDetailsObj = accounts.reduce((acc, cur) => {
      if (cur.txnDetails) acc[cur.currency] = cur.txnDetails;
      return acc;
    }, {});

    const keepData = {
      defaultAccount: selectedAccount.accountNo,
      defaultCurrency: selectedAccount.currency,
      txnDetailsObj,
    };
    startFunc(funcCode, params, keepData);
  };

  /**
   * 頁面輸出
   */
  return (
    <Layout fid={Func.C004} title="外幣活存">
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
                  fid: Func.D007.id,
                  title: '轉帳',
                  enabled:
                    selectedAccount.transable && selectedAccount.balance > 0,
                },
                {
                  fid: Func.E001.id,
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
                  fid: Func.E004.id,
                  title: '外幣到價通知設定',
                  icon: 'foreignCurrencyPriceSetting',
                },
                { fid: 'Rename', title: '帳戶名稱編輯', icon: 'edit' },
              ]}
            />

            {/* 顯示 優惠利率資訊面版 */}
            {renderBonusInfoPanel()}

            <DepositDetailPanel
              details={selectedAccount.txnDetails}
              onMoreFuncClick={() => handleFunctionClick('moreTranscations')}
            />
          </>
        ) : null}
      </PageWrapper>
    </Layout>
  );
};

export default C00400;
