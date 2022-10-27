/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';

import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import Badge from 'components/Badge';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { currencySymbolGenerator } from 'utilities/Generator';

import { getThisMonth } from 'utilities/MonthGenerator';
import { getBills } from './api';
import Reminder from './components/Reminder';
import Transactions from './components/Transactions';
import BillDetails from './components/BillDetails';
import Terms from './components/Terms';
import Tray from './components/Tray';
import PageWrapper from './R00300.style';

/**
 * R00300 信用卡 帳單頁
 */
const Page = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [bills, setBills] = useState();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    let accountNo;
    if (location.state && ('accountNo' in location.state)) accountNo = location.state.accountNo;

    // const response = await getBills(getThisMonth()); // TODO: 抓系統時間（YYYYMM）作為此處參數傳入
    const response = await getBills('202207'); // 測試時使用202207

    setBills(response);
    dispatch(setWaittingVisible(false));
  }, []);

  const handleGoBack = () => {
    if (isExpanded) setIsExpanded(false);
    else history.goBack();
  };

  return (
    <Layout title="信用卡帳單" goBackFunc={handleGoBack}>
      <Main small>
        <PageWrapper>
          <Badge label={`${bills?.month}月應繳金額`} value={currencySymbolGenerator(bills?.currency ?? 'NTD', bills?.amount)} />
          { bills?.amount > 0 && (
            <Reminder bills={bills} />
          )}
          <Transactions bills={bills} isExpanded={isExpanded} onExpandClick={() => setIsExpanded(true)} />
          { bills?.amount > 0 && (
            <>
              <BillDetails />
              <Terms />
              { isExpanded && (
                <div className="fixed-bottom">更多帳單資訊請滑至底部查看</div>
              )}
              <Tray bills={bills} />
            </>
          )}
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
