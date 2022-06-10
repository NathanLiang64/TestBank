import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import Badge from 'components/Badge';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { currencySymbolGenerator } from 'utilities/Generator';

import { getBills } from './api';
import Reminder from './components/Reminder';
import Transactions from './components/Transactions';
import BillDetails from './components/BillDetails';
import Terms from './components/Terms';
import Tray from './components/Tray';
import PageWrapper from './R00300.style';

/**
 * C00700 信用卡 帳單頁
 */
const Page = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [bills, setBills] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    // TODO Read accountNo from location.
    const response = await getBills();
    setBills(response);
    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="信用卡帳單" goBackFunc={() => history.goBack()}>
      <Main small>
        <PageWrapper>
          <Badge label={`${bills?.month}月應繳金額`} value={currencySymbolGenerator(bills?.currency ?? 'NTD', bills?.amount)} />
          <Reminder bills={bills} />
          <Transactions bills={bills} />
          <BillDetails />
          <Terms />
          <Tray />
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
