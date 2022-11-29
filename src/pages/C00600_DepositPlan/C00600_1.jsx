/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';

import Layout from 'components/Layout/Layout';
import AccountDetails from 'components/AccountDetails/accountDetails';
import { closeFunc } from 'utilities/AppScriptProxy';
import { dateToYMD } from 'utilities/Generator';
import { showError } from 'utilities/MessageModal';

import { getTransactionDetails } from './api';

/**
 * C00600 存錢計畫 歷程頁
 */
const DepositPlanTransactionPage = () => {
  const [plan, setPlan] = useState(null);
  const history = useHistory();
  const {state} = useLocation();

  useEffect(async () => {
    // 從別的頁面跳轉至此頁時，應指定所查詢的帳戶。
    if (state?.plan) {
      setPlan({
        ...state.plan,
        accountNo: state.plan.bindAccountNo,
        balance: state.plan.currentBalance,
      });
    } else {
      showError('查無計畫', closeFunc);
    }
  }, []);

  /**
   * 更新帳戶交易明細清單
   * @param {*} conditions 查詢條件。
   */
  const updateTransactions = async (conditions) => {
    const request = {
      accountNo: plan?.bindAccountNo,
      startDate: dateToYMD(plan.createDate), // 查詢啟示日為計畫建立的當天
      endDate: plan?.endDate,
      ...conditions,
    };

    // 取得帳戶交易明細（三年內）
    const transData = await getTransactionDetails(request);
    return transData;

    // 先暫時回傳 mockData 測試
    // const mockData = { acctTxDtls, monthly: [], startIndex: 1 };
    // return mockData;
  };

  return (
    <Layout title="存錢歷程" hasClearHeader goBackFunc={() => history.goBack()}>
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
