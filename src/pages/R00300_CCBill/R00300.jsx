import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getThisMonth } from 'utilities/MonthGenerator';
import { currencySymbolGenerator } from 'utilities/Generator';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { Func } from 'utilities/FuncID';

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
  const [billsMap, setBillsMap] = useState({});
  const [deductInfo, setDeductInfo] = useState();
  const [isExpanded, setIsExpanded] = useState(false);

  // 依照所選月份取得帳單資料並儲存在map中
  const fetchBillsMap = async (month) => {
    const currentBills = await getBillDetail(month);

    setBillsMap((prevMap) => ({
      ...prevMap,
      [month]: currentBills,
    }));
  };

  // 切換頁籤時，拿取當下月份的帳單資料
  const onMonthChange = async (selectedMonth) => {
    setCurrentMonth(selectedMonth);

    if (billsMap[selectedMonth]) return;
    fetchBillsMap(selectedMonth);
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    fetchBillsMap(currentMonth);
    dispatch(setWaittingVisible(false));
  }, []);

  // 繳款期限資訊使用lazy loading
  useEffect(async () => {
    const deductRt = await getBillDeducStatus();
    setDeductInfo(deductRt);
  }, []);

  const handleGoBack = () => {
    if (isExpanded) setIsExpanded(false);
    else closeFunc();
  };

  return (
    <Layout fid={Func.R003} title="信用卡帳單" goBackFunc={handleGoBack}>
      <Main small>
        <PageWrapper>
          <Badge
            label={`${parseInt(currentMonth.slice(-2), 10).toString()}月應繳金額`}
            value={currencySymbolGenerator(billsMap[currentMonth]?.currency ?? 'NTD', billsMap[currentMonth]?.newBalance ?? 0)}
          />
          {!!deductInfo && <Reminder bills={billsMap[currentMonth]} deductInfo={deductInfo} />}
          <Transactions
            bills={billsMap[currentMonth]}
            isExpanded={isExpanded}
            onExpandClick={() => setIsExpanded(true)}
            handleChangeMonth={onMonthChange}
          />
          { billsMap[currentMonth]?.newBalance > 0 && (
            <>
              <BillDetails bills={billsMap[currentMonth]} />
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
