/* eslint-disable no-use-before-define */
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
import { getAccountSummary, getTransactionDetails } from './api';

const ForeignCurrencyAccount = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const [accounts, setAccounts] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState(null);

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 以啟動參數(外幣帳號)為預設值；若沒有設，則以第一個帳號為預設值。
    const model = loadFuncParams() ?? { // Function Controller 提供的參數
      accounts: null,
      selectedAccount: null,
    };

    // 首次加載時取得用戶所有外幣的存款帳戶摘要資訊
    if (!model.accounts) {
      const acctData = await getAccountSummary('F'); // F=外幣
      model.accounts = Object.assign({}, ...acctData.map((acct) => ({ // Note: 將陣列(Array)轉為字典(Object/HashMap)
        [acct.acctId]: {
          cardInfo: acct,
          // 以下屬性在 selectedAccount 變更時取得。
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
   * 更新帳戶交易明細清單
   */
  const updateTransactions = async (account) => {
    setTransactions(null);
    if (account.transactions === null) {
      const request = {
        account: account.cardInfo.acctId,
        currency: account.cardInfo.ccyCd,
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
      updateTransactions(account); // 取得帳戶交易明細（三年內的前25筆即可
    }
  }, [selectedAccount]);
  const getSelectedAccount = () => sessionStorage.getItem('selectedAccount'); // Note: 暫時解決方案。

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
      case 'foreignCurrencyAccountDetails': // 更多明細
        params = accounts[selectedAccount].cardInfo; // 直接提供帳戶摘要資訊，因為一定是從有帳戶資訊的頁面進去。
        break;
      case 'foreignCurrencyTransfer': // 轉帳
      case 'exchange': // 換匯
        params = model; // 直接提供帳戶摘要資訊，可以減少Call API；但也可以傳 null 要求重載。
        break;
      case 'rename': // 帳戶名稱編輯
        showRenameDialog(accounts[selectedAccount].cardInfo.acctName);
        return;
      case 'setMainAccount': // 設定為主要外幣帳戶
        // TODO: 將目前帳戶 設定為主要外幣帳戶
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
      <div>
        {/* TODO：外幣有小數位數的問題 */}
        <AccountOverview
          accounts={Object.values(accounts ?? [])}
          onAccountChange={handleChangeAccount}
          onFunctionChange={handleFunctionChange}
          cardColor="blue"
          funcList={[
            { fid: 'foreignCurrencyTransfer', title: '轉帳' },
            { fid: 'exchange', title: '換匯' },
          ]}
          moreFuncs={[
            { fid: 'masterCardXB', title: 'MasterCard Send Cross Border', icon: 'temp' },
            { fid: 'setMainAccount', title: '設定為主要外幣帳戶', icon: 'temp' },
            { fid: 'rename', title: '帳戶名稱編輯', icon: 'edit' },
          ]}
        />

        <DepositDetailPanel
          details={transactions}
          onClick={() => handleFunctionChange('foreignCurrencyAccountDetails')}
        />
      </div>
    </Layout>
  );
};

export default ForeignCurrencyAccount;
