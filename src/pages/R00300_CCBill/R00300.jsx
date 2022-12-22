import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getThisMonth } from 'utilities/MonthGenerator';
import { currencySymbolGenerator } from 'utilities/Generator';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Element */
import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import Badge from 'components/Badge';
import Accordion from 'components/Accordion';
import { useNavigation } from 'hooks/useNavigation';
import AccordionContent from './components/AccordionContent';
import Reminder from './components/Reminder';
import Transactions from './components/Transactions';
import BillDetails from './components/BillDetails';
import Tray from './components/Tray';

/* Data */
import { getBillDeducStatus, getBillDetail } from './api';

/* Style */
import PageWrapper from './R00300.style';

/**
 * R00300 信用卡 帳單頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const { closeFunc } = useNavigation();
  const [currentMonth, setCurrentMonth] = useState(getThisMonth());
  const [bills, setBills] = useState();
  const [deductInfo, setDeductInfo] = useState();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const deductRt = await getBillDeducStatus();
    const billsRt = await getBillDetail(currentMonth);
    console.log('R00300', {billsRt});

    setDeductInfo(deductRt);
    setBills(billsRt);
    dispatch(setWaittingVisible(false));
  }, []);

  const handleChangeMonth = async (selected) => {
    setCurrentMonth(selected);
    setBills(await getBillDetail(selected));
  };

  const handleGoBack = () => {
    if (isExpanded) setIsExpanded(false);
    else closeFunc();
  };

  return (
    <Layout title="信用卡帳單" goBackFunc={handleGoBack}>
      <Main small>
        <PageWrapper>
          <Badge
            label={`${parseInt(currentMonth.slice(-2), 10).toString()}月應繳金額`}
            value={currencySymbolGenerator(bills?.currency ?? 'NTD', bills?.newBalance ?? 0)}
          />
          <Reminder bills={bills} deductInfo={deductInfo} />
          <Transactions
            bills={bills}
            isExpanded={isExpanded}
            onExpandClick={() => setIsExpanded(true)}
            handleChangeMonth={handleChangeMonth}
          />
          { bills?.newBalance > 0 && (
            <>
              <BillDetails bills={bills} />
              <Accordion>
                <AccordionContent />
              </Accordion>
              { isExpanded && (
                <div className="fixed-bottom">更多帳單資訊請滑至底部查看</div>
              )}
              <Tray deductInfo={deductInfo} />
            </>
          )}
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
