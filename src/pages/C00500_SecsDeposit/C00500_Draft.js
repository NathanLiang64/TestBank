/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

/* Elements */
import Layout from 'components/Layout/Layout';
import AccountOverview from 'components/AccountOverview/AccountOverview';
import DepositDetailPanel from 'components/DepositDetailPanel/depositDetailPanel';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import {
  customPopup, showCustomDrawer, showCustomPrompt, showPrompt,
} from 'utilities/MessageModal';
import { loadFuncParams } from 'utilities/AppScriptProxy';
import {
  getAccountExtraInfo,
  loadAccountsList,
} from 'pages/D00100_NtdTransfer/api';
import { FuncID } from 'utilities/FuncID';
import { TextInputField } from 'components/Fields';
import { useNavigation } from 'hooks/useNavigation';
import {
  getTransactions,
  downloadDepositBookCover,
  setAccountAlias,
} from './api';
import PageWrapper from './C00500.style';

/**
 * C00500 台幣交割帳戶首頁
 */
const C00500Modified = () => {
  const dispatch = useDispatch();
  const { startFunc, closeFunc } = useNavigation();
  const [accounts, setAccounts] = useState();
  const [selectedAccountIdx, setSelectedAccountIdx] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const selectedAccount = useMemo(() => {
    if (!accounts || !accounts.length) return null;
    return accounts[selectedAccountIdx];
  }, [accounts, selectedAccountIdx]);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { newName: '' },
  });

  /**
   * 更新帳戶交易明細清單
   */
  const updateTransactions = async (account) => {
    const { accountNo } = account;
    // 取得帳戶交易明細（三年內的前25筆即可）

    const transData = await getTransactions(accountNo);
    const txnDetails = transData.acctTxDtls.slice(0, 10); // 最多只需保留 10筆。

    if (txnDetails.length > 0) {
      setAccounts((prevAccts) => prevAccts.map((prevAcct) => {
        if (prevAcct.accountNo === accountNo) {
          return { ...prevAcct, balance: txnDetails[0].balance };
        }
        return prevAcct;
      }));
    }

    setTransactions((prevTransactions) => ({...prevTransactions, [accountNo]: txnDetails}));
  };

  /**
   * 根據當前帳戶取得交易明細資料及優惠利率數字
   */
  const handleAccountChanged = async (acctIndex) => {
    if (!accounts || !accounts.length) return; // 頁面初始化時，不需要進來。

    const account = accounts[acctIndex];

    // 若還沒有取得 免費跨轉次數 則立即補上。
    if (!account.freeTransfer) {
      const extraInfo = await getAccountExtraInfo(account.accountNo);

      if (extraInfo) {
        const newAccounts = accounts.map((acc, index) => (index === acctIndex ? { ...acc, ...extraInfo } : acc));
        setAccounts(newAccounts);
        updateTransactions(newAccounts[acctIndex]); // 取得帳戶交易明細（三年內的前25筆即可)
      }
    } else {
      updateTransactions(account); // 取得帳戶交易明細（三年內的前25筆即可)
    }
  };

  /**
   * 編輯帳戶名稱
   * @param {*} name 原始帳戶名稱
   */
  const showRenameDialog = async () => {
    const body = (
      <>
        <TextInputField
          name="newName"
          control={control}
          labelName="新的帳戶名稱"
          inputProps={{ placeholder: '請設定此帳戶的專屬名稱' }}

        />
      </>
    );
    const onSubmit = async (values) => {
      await setAccountAlias(selectedAccount.accountNo, values.newName);
      const updatedNewAccounts = accounts.map((account) => {
        if (account.accountNo === selectedAccount.accountNo) return {...account, alias: values.newName};
        return account;
      });
      setAccounts(updatedNewAccounts);
    };
    await showCustomPrompt({
      title: '帳戶名稱編輯',
      message: body,
      onOk: handleSubmit(onSubmit),
      onClose: () => reset({newName: selectedAccount.alias}),
    });
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

      case FuncID.E00100_換匯: // 換匯
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
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
    // NOTE 使用非同步方式更新畫面，一開始會先顯示帳戶基本資料，待取得跨轉等資訊時再更新一次畫面。
    await loadAccountsList('S', setAccounts); // S=台幣交割帳戶

    const startParams = await loadFuncParams(); // Function Controller 提供的參數
    if (startParams && typeof startParams === 'object') {
      setSelectedAccountIdx(startParams.selectedAccountIdx);
    }
  }, []);

  // 確認是否有 accounts 後再去拿取 transactions 資料，
  // 切換 slides 時候，需要更新 accounts 以及 transactions
  useEffect(async () => {
    if (!accounts) return;
    dispatch(setWaittingVisible(false));
    if (accounts.length === 0) {
      await showPrompt(
        '您還沒有任何證券交割的存款帳戶，請在系統關閉此功能後，立即申請。',
        () => closeFunc(),
      );
    } else {
      handleAccountChanged(selectedAccountIdx ?? 0);
      reset({newName: accounts[selectedAccountIdx].alias});
    }
  }, [accounts, selectedAccountIdx]);

  /**
   * 頁面輸出
   */
  return (
    <Layout title="證券交割戶">
      <PageWrapper small>
        {selectedAccount && (
          <>
            <AccountOverview
              accounts={accounts}
              defaultSlide={selectedAccountIdx}
              onAccountChanged={setSelectedAccountIdx}
              onFunctionClick={handleFunctionClick}
              cardColor="blue"
              funcList={[
                {
                  fid: FuncID.D00100_台幣轉帳,
                  title: '轉帳',
                  enabled:
                    selectedAccount.transable
                    && selectedAccount.balance > 0,
                },
                {
                  fid: FuncID.E00100_換匯,
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
              details={transactions[selectedAccount.accountNo]}
              onMoreFuncClick={() => handleFunctionClick('moreTranscations')}
            />
          </>
        ) }
      </PageWrapper>
    </Layout>
  );
};
export default C00500Modified;
