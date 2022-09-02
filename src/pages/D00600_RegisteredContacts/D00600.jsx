import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';
import { showDrawer } from 'utilities/MessageModal';
import { loadLocalData, setLocalData } from 'utilities/Generator';
import { setDrawerVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';
import { getAllRegisteredAccount, updateRegisteredAccount } from './api';
import AccountEditor from './D00600_AccountEditor';
import PageWrapper from './D00600.style';

/**
 * D00600 約定帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState([]);

  const storageName = 'RegAccts';

  /**
   *- 初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // TODO 若有指定帳號，則只取單一帳號的約定帳號清單。
    // TODO 未指定帳號時，應改用頁韱分類。
    const accts = await loadLocalData(storageName, getAllRegisteredAccount);
    setAccounts(accts);

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 處理UI流程：編輯帳戶
   * @param {*} acct 變更前資料。
   */
  const editAccount = async (acct) => {
    const onFinished = async (newAcct) => {
      const successful = await updateRegisteredAccount(newAcct);
      dispatch(setDrawerVisible(false));
      if (successful) {
        setAccounts(setLocalData(storageName, [...accounts])); // 強制更新清單。
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
              type="約定帳號"
              name={acct.nickName}
              bankNo={acct.bankId}
              bankName={acct.bankName}
              account={acct.acctId}
              avatarSrc={acct.headshot}
              onEdit={() => editAccount(acct)}
            />
          )) }
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
