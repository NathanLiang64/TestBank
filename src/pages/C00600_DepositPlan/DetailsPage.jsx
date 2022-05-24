/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

/* Elements */
import Layout from 'components/Layout/Layout';
import AccountDetails from 'components/AccountDetails/accountDetails';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
// import { loadFuncParams } from 'utilities/BankeePlus';
import { getTransactionDetails } from './api';

const MoreTranscations = () => {
  const dispatch = useDispatch();

  const [plan, setPlan] = useState(null);

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 以啟動參數(預設帳號)
    // const model = loadFuncParams();
    const model = {
      bindAccountNo: '04300498016343',
    };
    setPlan(model);

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 更新帳戶交易明細清單
   * @param {*} conditions 查詢條件。
   */
  const updateTransactions = async (conditions) => {
    const request = {
      ...conditions,
      accountNo: plan.bindAccountNo,
      currency: 'TWD',
    };

    // 取得帳戶交易明細（三年內）
    const transData = await getTransactionDetails(request);
    return transData;
  };

  /**
   * 頁面輸出
   */
  return (
    <Layout title="存錢歷程">
      {plan ? (
        <AccountDetails
          selectedAccount={plan}
          onSearch={updateTransactions}
          mode={1}
        />
      ) : null}
    </Layout>
  );
};

export default MoreTranscations;
