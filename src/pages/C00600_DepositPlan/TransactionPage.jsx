import { useState, useEffect } from 'react';

import Layout from 'components/Layout/Layout';
import AccountDetails from 'components/AccountDetails/accountDetails';
import { loadFuncParams, closeFunc } from 'utilities/AppScriptProxy';
import { getTransactionDetails } from './api';

/**
 * C00600 存錢計畫 歷程頁
 */
const DepositPlanTransactionPage = () => {
  const [plan, setPlan] = useState(null);

  /**
   * 從別的頁面跳轉至此頁時，應指定所查詢的帳戶。
   */
  useEffect(async () => {
    // startParams: 要顯示明細的存錢計劃詳細資料，規格參照：api.js - getDepositPlans API
    const startParams = await loadFuncParams(); // Function Controller 提供的參數
    if (startParams && (typeof startParams === 'object')) {
      setPlan(startParams);
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
    <Layout title="存錢歷程" hasClearHeader goBackFunc={() => closeFunc()}>
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
