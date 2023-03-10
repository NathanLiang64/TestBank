import { useHistory, useLocation } from 'react-router';
import { useEffect } from 'react';

import Layout from 'components/Layout/Layout';
import AccountDetails from 'components/AccountDetails/accountDetails';
import { Func } from 'utilities/FuncID';
import { dateToYMD, timeToString } from 'utilities/Generator';

import { getTransactionDetails } from './api';

/**
 * C00600 存錢計畫 歷程頁
 */
const DepositPlanTransactionPage = () => {
  // const [plan, setPlan] = useState(null);
  const history = useHistory();
  const {state} = useLocation();
  const plan = {
    ...state.plan,
    accountNo: state.plan.bindAccountNo,
    balance: state.plan.currentBalance,
  };

  /**
   * 更新帳戶交易明細清單
   * @param {*} conditions 查詢條件。
   */
  const updateTransactions = async (conditions) => {
    const {startDate, endDate, ...restConditions} = conditions;
    // NOTE: plan.createDate 是 ISO string，需轉成 YYYYMMDD 以及 hhmmss 格式
    const defaultStartDate = dateToYMD(new Date(plan.createDate));
    const defaultStartTime = timeToString(new Date(plan.createDate)).replaceAll(':', '');

    const request = {
      accountNo: plan?.bindAccountNo,
      startDate: startDate ?? defaultStartDate, // 預設起始日為計畫建立的當天
      startTime: !startDate || startDate === defaultStartDate ? defaultStartTime : null,
      endDate: endDate ?? plan?.endDate,
      ...restConditions,
    };

    // 取得帳戶交易明細（三年內）
    const transData = await getTransactionDetails(request);
    return transData;
  };

  /**
   * 此HOOK目的是將在AccountDetails組件內所取得的最新一筆明細, 更新資料回state
   */
  useEffect(() => {
    state.depositPlans.plans.forEach((p, index) => {
      if (plan.planId === p.planId) state.depositPlans.plans[index] = plan;
    });

    state.plan = plan;
  }, []);

  return (
    <Layout title="存錢歷程" hasClearHeader goBackFunc={() => history.replace(`${Func.C006.id}00`, state)}>
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
