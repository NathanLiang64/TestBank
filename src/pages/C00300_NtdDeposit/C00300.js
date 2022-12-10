/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-first-prop-new-line */
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

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { customPopup, showPrompt } from 'utilities/MessageModal';
import { loadFuncParams, startFunc, closeFunc } from 'utilities/AppScriptProxy';
import { switchZhNumber, toCurrency } from 'utilities/Generator';
import { getAccountsList, resetAccountsList } from 'utilities/CacheData';
import { getAccountExtraInfo } from 'pages/D00100_NtdTransfer/api';
import { ArrowNextIcon, SwitchIcon } from 'assets/images/icons';
import {
  getTransactions,
  downloadDepositBookCover,
  setAccountAlias,
} from './api';
import PageWrapper from './C00300.style';

/**
 * C00300 台幣帳戶首頁
 */
const C00300 = () => {
  const dispatch = useDispatch();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const { register, unregister, handleSubmit } = useForm();

  const [accounts, setAccounts] = useState();
  const [selectedAccountIdx, setSelectedAccountIdx] = useState();

  const selectedAccount = accounts ? accounts[selectedAccountIdx ?? 0] : null;

  // 優存(利率/利息)資訊 顯示模式（true.優惠利率, false.累積利息)
  const [showRate, setShowRate] = useState();

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
    // NOTE 使用非同步方式更新畫面，一開始會先顯示帳戶基本資料，待取得跨轉等資訊時再更新一次畫面。
    getAccountsList('MC', async (items) => { // M=台幣主帳戶、C=台幣子帳戶
      if (items.length === 0) {
        await showPrompt('您還沒有任何台幣存款帳戶，請在系統關閉此功能後，立即申請。', () => closeFunc());
      } else {
        setAccounts(items);

        /* model: {
             selectedAccount: 預設帳號
             showRate: 優存(利率/利息)資訊 顯示模式
           }
         */
        const startParams = await loadFuncParams(); // Function Controller 提供的參數
        // 取得 Function Controller 提供的 keepData(model)
        if (startParams && (typeof startParams === 'object')) {
          const index = items.findIndex((acc) => acc.accountNo === startParams.selectedAccount);
          setSelectedAccountIdx(index);
          setShowRate(startParams.showRate);
        } else {
          setSelectedAccountIdx(0);
          setShowRate(true);
        }
        dispatch(setWaittingVisible(false));
      }
    });
  }, []);

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
        getTransactions(account.accountNo).then((transData) => {
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
   * 下載 優存(利率/利息)資訊
   */
  const loadExtraInfo = (account) => {
    if (!account.isLoadingExtra) {
      account.isLoadingExtra = true; // 避免因為非同步執行造成的重覆下載
      getAccountExtraInfo(account.accountNo).then((info) => {
        account.freeTransferRemain = info.freeTransferRemain;
        account.freeWithdrawRemain = info.freeWithdrawRemain;
        account.bonusQuota = info.bonusQuota;
        account.bonusRate = info.bonusRate;
        account.interest = info.interest;

        delete account.isLoadingExtra; // 載入完成才能清掉旗標！
        forceUpdate();
      });
    }
  };

  /**
   * 顯示 優存(利率/利息)資訊
   */
  const renderBonusInfoPanel = () => {
    if (!selectedAccount) return null;

    const { freeWithdrawRemain, freeTransferRemain, bonusQuota, bonusRate, interest } = selectedAccount;
    if (!freeTransferRemain) {
      loadExtraInfo(selectedAccount);
      return (
        <div style={{ lineHeight: '5.28833rem', textAlign: 'center', marginBottom: '1.6rem' }}>載入中...</div>
      );
    }

    const value1 = bonusRate ? `${bonusRate * 100}%` : '-';
    const value2 = (interest >= 0) ? `$${toCurrency(interest)}` : '-';
    return (
      <div className="interestRatePanel">
        <div className="panelItem">
          <h3>免費跨提/轉</h3>
          <p>{`${freeWithdrawRemain}/${freeTransferRemain}`}</p>
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
          <p>{switchZhNumber(bonusQuota, false)}</p>
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
        <FEIBInput {...register('newName')} autoFocus
          inputProps={{ maxLength: 10, placeholder: '請設定此帳戶的專屬名稱', defaultValue: name, autoComplete: 'off' }}
        />
      </>
    );
    const onOk = (values) => {
      selectedAccount.alias = values.newName; // 變更卡片上的帳戶名稱
      setAccountAlias(selectedAccount.accountNo, selectedAccount.alias);
      forceUpdate();

      resetAccountsList(); // 清除帳號基本資料快取，直到下次使用 getAccountsList 時再重新載入。
    };
    await customPopup('帳戶名稱編輯', body, handleSubmit(onOk));
  };

  /**
   * 執行指定的單元功能。
   * @param {*} funcCode 功能代碼
   */
  const handleFunctionClick = async (funcCode) => {
    let params = null;
    const model = { selectedAccount: selectedAccount.accountNo, showRate };
    switch (funcCode) {
      case 'moreTranscations': // 更多明細
        params = {
          ...selectedAccount, // 直接提供帳戶摘要資訊就不用再下載。
          cardColor: 'purple',
        };
        break;

      case 'D00100': // 轉帳
        params = { transOut: selectedAccount.accountNo };
        break;

      case 'D00300': // 無卡提款，只有母帳號才可以使用。 // TODO 帶參數過去
        params = { transOut: selectedAccount.accountNo };
        break;

      case 'E00100': // 換匯 // TODO 帶參數過去
        params = { transOut: selectedAccount.accountNo };
        break;

      case 'DownloadCover': // 存摺封面下載
        downloadDepositBookCover(selectedAccount.accountNo); // 預設檔名為「帳號-日期.pdf」，密碼：身分證號碼
        return;

      case 'Rename': // 帳戶名稱編輯
        showRenameDialog(selectedAccount.alias);
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
      <PageWrapper small>
        {selectedAccount
          ? (
            <>
              <AccountOverview
                accounts={accounts}
                defaultSlide={selectedAccountIdx}
                onAccountChanged={setSelectedAccountIdx}
                onFunctionClick={handleFunctionClick}
                cardColor="purple"
                funcList={[
                  { fid: 'D00100', title: '轉帳', enabled: (selectedAccount.transable && selectedAccount.balance > 0) },
                  { fid: 'D00300', title: '無卡提款', enabled: (selectedAccount.balance > 0), hidden: (selectedAccount.acctType !== 'M') },
                ]}
                moreFuncs={[
                  { fid: null, title: '定存', icon: 'fixedDeposit', enabled: false },
                  { fid: 'E00100', title: '換匯', icon: 'exchange', enabled: (selectedAccount.balance > 0) },
                  { fid: 'DownloadCover', title: '存摺封面下載', icon: 'coverDownload' },
                  { fid: 'Rename', title: '帳戶名稱編輯', icon: 'edit' },
                ]}
              />

              {/* 顯示 優惠利率資訊面版 */}
              { renderBonusInfoPanel() }

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

export default C00300;
