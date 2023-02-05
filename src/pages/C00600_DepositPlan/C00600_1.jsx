import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';

import Layout from 'components/Layout/Layout';
import AccountDetails from 'components/AccountDetails/accountDetails';

import { dateToYMD } from 'utilities/Generator';
import { showError } from 'utilities/MessageModal';

import { useNavigation } from 'hooks/useNavigation';
import { Func } from 'utilities/FuncID';
import { getTransactionDetails } from './api';

/**
 * C00600 存錢計畫 歷程頁
 */
const DepositPlanTransactionPage = () => {
  const [plan, setPlan] = useState(null);
  const history = useHistory();
  const { closeFunc } = useNavigation();
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
      // TODO plan 內的 createDate 格式為 '2022-11-28T05:49:11Z'，應該請後端修改成與 endDate 相同格式(YYYYMMDD)
      startDate: dateToYMD(new Date(plan.createDate)), // 查詢起始日為計畫建立的當天
      endDate: plan?.endDate,
      ...conditions,
    };

    // 取得帳戶交易明細（三年內）
    const transData = await getTransactionDetails(request);
    return transData;
  };

  return (
    <Layout title="存錢歷程" hasClearHeader goBackFunc={() => history.replace(Func.C00600.id, {depositPlans: state.depositPlans})}>
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
