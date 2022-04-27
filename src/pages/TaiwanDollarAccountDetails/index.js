/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

/* Elements */
import Layout from 'components/Layout/Layout';
import AccountDetails from 'components/AccountDetails';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { loadFuncParams } from 'utilities/BankeePlus';
import { getTransactionDetails } from './api';

const TaiwanDollarAccountDetails = () => {
  const dispatch = useDispatch();

  const [account, setAccount] = useState(null);
  const [months, setMonths] = useState(null);
  const [transactions, setTransactions] = useState(null);

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 以啟動參數(預設帳號)
    const model = loadFuncParams();
    setAccount(model);

    dispatch(setWaittingVisible(false));
  }, []);

  useEffect(async () => {
    if (account) await updateTransactions();
  }, [account]);

  /**
   * 更新帳戶交易明細清單
   */
  const updateTransactions = async (conditions) => {
    const request = {
      ...conditions,
      account: account.acctId,
    };
    console.log(conditions);

    // 取得帳戶交易明細（三年內）
    const transData = await getTransactionDetails(request);

    setMonths(transData.monthly);
    setTransactions(transData);
  };

  /**
   * 頁面輸出
   */
  return (
    <Layout title="台幣存款交易明細">
      <div>
        <AccountDetails
          selectedAccount={account}
          txnDetails={transactions?.acctTxDtls}
          monthly={months}
          onTabClick={updateTransactions}
          onScroll={updateTransactions}
          onSearch={updateTransactions}
          cardColor="purple"
        />
      </div>
    </Layout>
  );
};

export default TaiwanDollarAccountDetails;
