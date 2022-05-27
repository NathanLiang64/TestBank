import { useState, useEffect } from 'react';

import { useLocation } from 'react-router';

import Layout from 'components/Layout/Layout';
import AccountDetails from 'components/AccountDetails/accountDetails';

import { getTransactionDetails } from './api';

/**
 * C00600 存錢計畫 歷程頁
 */
const DepositPlanTransactionPage = () => {
  const location = useLocation();
  const [plan, setPlan] = useState(null);

  /**
   * 從別的頁面跳轉至此頁時，應指定所查詢的帳戶。
   */
  useEffect(() => {
    if (location.state && ('plan' in location.state)) {
      setPlan(location.state.plan);
    }
  }, []);

  /**
   * 更新帳戶交易明細清單
   * @param {*} conditions 查詢條件。
   */
  const updateTransactions = async (conditions) => {
    const request = {
      ...conditions,
      accountNo: plan?.bindAccountNo,
      startDate: plan?.startDate,
      endDate: plan?.endDate,
      currency: 'TWD',
    };

    // 取得帳戶交易明細（三年內）
    const transData = await getTransactionDetails(request);
    return transData;
  };

  return (
    <Layout title="存錢歷程" hasClearHeader>
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

export default DepositPlanTransactionPage;
