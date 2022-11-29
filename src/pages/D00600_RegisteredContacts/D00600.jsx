/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';
import { showDrawer } from 'utilities/MessageModal';
import { loadFuncParams, closeFunc } from 'utilities/AppScriptProxy';
import { loadLocalData, setLocalData } from 'utilities/Generator';
import { setDrawerVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';
import { getAllAgreedAccount, updateAgreedAccount } from './api';
import AccountEditor from './D00600_AccountEditor';
import PageWrapper from './D00600.style';

/**
 * D00600 約定帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const [selectorMode, setSelectorMode] = useState();
  const [bindAccount, setBindAccount] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState();

  const storageName = 'RegAccts';

  /**
   *- 初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    let bindAcct = null;
    // Function Controller 提供的參數
    // startParams = {
    //   selectorMode: true, 表示選取帳號模式，啟用時要隱藏 Home 圖示。
    //   defaultAccount: 指定的帳號將設為已選取狀態
    //   bindAccount: 只列出此帳號設定的約轉帳號清單。
    // };
    const startParams = await loadFuncParams();
    if (startParams) {
      bindAcct = startParams?.bindAccount;
      setBindAccount(bindAcct);
      setSelectorMode(startParams.selectorMode ?? false);
      setSelectedAccount(startParams?.defaultAccount);
    }

    // 若有指定帳號，則只取單一帳號的約定帳號清單。
    // TODO 未指定帳號時，應改用頁韱分類。
    const accts = await loadLocalData(`${storageName}`, () => getAllAgreedAccount(bindAcct));
    setAccounts(accts);

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 將選取的帳號傳回給叫用的單元功能，已知[轉帳]有使用。
   * @param {*} acct 選取的帳號。
   */
  const onAccountSelected = (acct) => {
    if (selectorMode) {
      const response = {
        memberId: acct.memberId,
        accountName: acct.nickName,
        bankName: acct.bankName,
        bankId: acct.bankId,
        accountNo: acct.acctId,
      };
      closeFunc(response);
    }
  };

  /**
   * 處理UI流程：編輯帳戶
   * @param {*} acct 變更前資料。
   */
  const editAccount = async (acct) => {
    const onFinished = async (newAcct) => {
      const successful = await updateAgreedAccount(newAcct);

      dispatch(setDrawerVisible(false));
      if (successful) {
        const updatedAccounts = accounts.map((account) => {
          if (account.acctId === newAcct.acctId) return newAcct;
          return account;
        });
        const setData = await setLocalData(`${storageName}`, updatedAccounts);
        setAccounts(setData); // 強制更新清單。
      }
    };

    await showDrawer('編輯約定帳號', (<AccountEditor initData={acct} onFinished={onFinished} />));
  };

  /**
   * 顯示帳戶列表
   */
  return (
    <Layout title="約定帳號管理">
      <Main small>
        <PageWrapper>
          {accounts?.map((acct) => (
            <MemberAccountCard
              key={acct.acctId}
              name={acct.nickName}
              bankNo={acct.bankId}
              bankName={acct.bankName}
              account={acct.acctId}
              memberId={acct.memberId}
              isSelected={(acct.acctId === selectedAccount)}
              onClick={() => onAccountSelected(acct)} // 傳回值：選取的帳號。
              moreActions={[
                { lable: '編輯', type: 'edit', onClick: () => editAccount(acct) },
              ]}
            />
          )) }
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
