import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';

import { currencySymbolGenerator } from 'utilities/Generator';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import InformationTape from 'components/InformationTape';
import BottomAction from 'components/BottomAction';
import EmptyData from 'components/EmptyData';

import { getTransactions } from './api';
import PageWrapper from './R00100.style';

/**
 * R00100 信用卡 即時消費明細
 */
const Page = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [card, setCard] = useState();
  const [transactions, setTransactions] = useState([]);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    let accountNo;
    if (location.state && ('accountNo' in location.state)) accountNo = location.state.accountNo;
    const response = await getTransactions({ accountNo, startDate: '20220601', endDate: '20220615' });
    setTransactions(response);

    setCard({
      type: location?.state?.type,
      accountNo: location?.state?.accountNo,
      creditUsed: location?.state?.expenditure,
    });

    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="信用卡即時消費明細" goBackFunc={() => history.goBack()}>
      <MainScrollWrapper>
        <PageWrapper>
          <div className="bg-gray">
            <div>TODO: insert card component here</div>
            <div>{ card?.type === 'bankee' ? 'Bankee信用卡' : '所有信用卡' }</div>
            <div>{ card?.accountNo }</div>
            <div>{ card?.creditUsed }</div>
          </div>
          <div className="txn-wrapper">
            { transactions.length > 0 ? transactions.map((t) => (
              <InformationTape
                topLeft={t.description}
                topRight={currencySymbolGenerator(t.currency ?? 'TWD', t.amount)}
                bottomLeft={t.txnDate}
                bottomRight="TODO: 替換InformationTape+編輯元件"
              />
            )) : (
              <div style={{ height: '20rem', marginTop: '6rem' }}>
                <EmptyData />
              </div>
            )}
          </div>
          <div className="note">實際請款金額以帳單為準</div>
          <BottomAction>
            <button type="button">晚點付</button>
          </BottomAction>
        </PageWrapper>
      </MainScrollWrapper>
    </Layout>
  );
};

export default Page;
