import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { AddIcon } from 'assets/images/icons';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';
import { showCustomDrawer, showCustomPrompt } from 'utilities/MessageModal';
import { loadFuncParams, closeFunc } from 'utilities/AppScriptProxy';
import { loadLocalData, setLocalData } from 'utilities/Generator';
import { setDrawerVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';

import {
  getAllFrequentAccount,
  addFrequentAccount,
  updateFrequentAccount,
  deleteFrequentAccount,
} from './api';

import AccountEditor from './D00500_AccountEditor';
import PageWrapper from './D00500.style';

/**
 * D00500 常用帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const [selectorMode, setSelectorMode] = useState();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState();

  const storageName = 'FreqAccts';

  /**
   *- 初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const accts = await loadLocalData(storageName, getAllFrequentAccount);
    setAccounts(accts);

    // Function Controller 提供的參數
    // startParams = {
    //   selectorMode: true, 表示選取帳號模式，啟用時要隱藏 Home 圖示。
    //   defaultAccount: 指定的帳號將設為已選取狀態
    // };
    const startParams = await loadFuncParams();
    if (startParams) {
      setSelectorMode(startParams.selectorMode ?? false);
      setSelectedAccount(startParams.defaultAccount);
    }

    dispatch(setWaittingVisible(false));
  }, []);
  /**
   * 將選取的帳號傳回給叫用的單元功能，已知[轉帳]有使用。
   * @param {*} acct 選取的帳號。
   */
  const onAccountSelected = (acct) => {
    if (selectorMode) {
      const response = {
        memberId: acct.headshot,
        accountName: acct.nickName,
        bankName: acct.bankName,
        bankId: acct.bankId,
        accountNo: acct.acctId,
      };
      closeFunc(response);
    }
  };

  /**
   * 處理UI流程：新增帳戶
   */
  const addnewAccount = async () => {
    const onFinished = async (newAcct) => {
      const successful = await addFrequentAccount(newAcct);
      if (successful) {
        const setData = await setLocalData(storageName, [{
          ...newAcct,
          isNew: true,
        }, ...accounts]);
        setAccounts(setData);
      }
      dispatch(setDrawerVisible(false));
    };

    await showCustomDrawer({
      title: '新增常用帳號',
      content: <AccountEditor onFinished={onFinished} />,
      noScrollable: true,
    });
  };

  /**
   * 處理UI流程：編輯帳戶
   * @param {*} acct 變更前資料。
   */
  const editAccount = async (acct) => {
    const { bankId, acctId } = acct; // 變更前 常用轉入帳戶-銀行代碼 及 帳號
    const onFinished = async (newAcct) => {
      const successful = await updateFrequentAccount({
        ...newAcct,
        orgBankId: bankId,
        orgAcctId: acctId,
      });
      if (successful) {
        const updatedAccount = accounts.map((account) => {
          if (account.acctId === acct.acctId) return newAcct;
          return account;
        });
        const setData = await setLocalData(storageName, updatedAccount);
        setAccounts(setLocalData(storageName, setData)); // 強制更新清單。
      }
      dispatch(setDrawerVisible(false));
    };

    await showCustomDrawer({
      title: '編輯常用帳號',
      content: <AccountEditor initData={acct} onFinished={onFinished} />,
      noScrollable: true,
    });
  };

  /**
   * 處理UI流程：移除登記帳戶
   */
  const removeAccount = async (acct) => {
    const onRemoveConfirm = async () => {
      const successful = await deleteFrequentAccount({ bankId: acct.bankId, acctId: acct.acctId });
      if (successful) {
        const tmpCards = accounts.filter((c) => c.acctId !== acct.acctId);
        setAccounts(setLocalData(storageName, tmpCards));
      }
    };

    await showCustomPrompt({
      title: '系統訊息',
      message: (<div style={{ textAlign: 'center' }}>您確定要刪除此帳號?</div>),
      okContent: '確定刪除',
      onOk: onRemoveConfirm,
      cancelContent: '我再想想',
    });
  };

  /**
   * 顯示帳戶列表
   */
  return (
    <Layout title="常用帳號管理" goHome={!selectorMode}>
      <Main small>
        <PageWrapper>
          <button type="button" aria-label="新增常用帳號" className="addMemberButtonArea" onClick={addnewAccount}>
            <div className="addMemberButtonIcon">
              <AddIcon />
            </div>
            <span className="addMemberButtonText">新增常用帳號</span>
          </button>
          {accounts?.map((acct) => (
            <MemberAccountCard
              key={acct.acctId}
              name={acct.nickName}
              bankNo={acct.bankId}
              bankName={acct.bankName}
              account={acct.acctId}
              avatarSrc={acct.headshot}
              hasNewTag={acct.isNew}
              isSelected={(acct.acctId === selectedAccount)}
              onClick={() => onAccountSelected(acct)} // 傳回值：選取的帳號。
              moreActions={[
                { lable: '編輯', type: 'edit', onClick: () => editAccount(acct) },
                { lable: '刪除', type: 'delete', onClick: () => removeAccount(acct) },
              ]}
            />
          )) }
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
