/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

/* Elements */
import Layout from 'components/Layout/Layout';
import AccountDetails from 'components/AccountDetails/accountDetails';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { loadFuncParams } from 'utilities/AppScriptProxy';
import { getTransactions } from './api';

const MoreTranscations = () => {
  const dispatch = useDispatch();

  const [account, setAccount] = useState(null);

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 以啟動參數(預設帳號)
    const model = await loadFuncParams();
    setAccount(model);

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 更新帳戶交易明細清單
   * @param {*} conditions 查詢條件。
   */
  const updateTransactions = async (conditions) => {
    const request = {
      ...conditions,
      accountNo: account.accountNo,
      currency: account.currency ?? 'TWD',
    };

    // 取得帳戶交易明細（三年內）
    const transData = await getTransactions(request);
    return transData;
  };

  /**
   * 頁面輸出
   */
  return (
    <Layout title={account?.cardTitle ?? '帳戶交易明細'}>
      <div>
        {account ? (
          <AccountDetails
            selectedAccount={account}
            onSearch={updateTransactions}
          />
        ) : null}
      </div>
    </Layout>
  );
};

export default MoreTranscations;
