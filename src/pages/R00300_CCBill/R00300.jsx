import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import Badge from 'components/Badge';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { currencySymbolGenerator } from 'utilities/Generator';

import { getThisMonth } from 'utilities/MonthGenerator';
import { closeFunc } from 'utilities/AppScriptProxy';
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
  const dispatch = useDispatch();
  const [bills, setBills] = useState();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getBills(getThisMonth());

    setBills(response);
    dispatch(setWaittingVisible(false));
  }, []);

  const handleChangeMonth = async (selectedMonth) => {
    const response = await getBills(selectedMonth);

    setBills(response);
  };

  const handleGoBack = () => {
    if (isExpanded) setIsExpanded(false);
    else closeFunc();
  };

  return (
    <Layout title="信用卡帳單" goBackFunc={handleGoBack}>
      <Main small>
        <PageWrapper>
          <Badge label={`${parseInt(bills?.month.slice(-2), 10).toString()}月應繳金額`} value={currencySymbolGenerator(bills?.currency ?? 'NTD', bills?.amount ? bills.amount : 0)} />
          <Reminder bills={bills} />
          <Transactions bills={bills} isExpanded={isExpanded} onExpandClick={() => setIsExpanded(true)} handleChangeMonth={handleChangeMonth} />
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
