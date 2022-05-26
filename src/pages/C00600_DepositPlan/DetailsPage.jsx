import { useState } from 'react';
import { useLocation } from 'react-router';

import Layout from 'components/Layout/Layout';
import AccountDetails from 'components/AccountDetails/accountDetails';
import EmptyData from 'components/EmptyData';

import { getTransactionDetails } from './api';

const MoreTranscations = () => {
  const location = useLocation();
  const [plan, setPlan] = useState(null);

  /**
   * 從別的頁面跳轉至此頁時，應指定所查詢的帳戶。
   */
  if (location.state && ('focusToAccountNo' in location.state)) {
    setPlan({
      accountNo: location.state.focusToAccountNo,
      startDate: location.state.startDate,
      endDate: location.state.endDate,
    });
  }

  /**
   * 更新帳戶交易明細清單
   * @param {*} conditions 查詢條件。
   */
  const updateTransactions = async (conditions) => {
    const request = {
      ...conditions,
      accountNo: plan?.accountNo,
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
      ) : <EmptyData />}
    </Layout>
  );
};

export default MoreTranscations;
