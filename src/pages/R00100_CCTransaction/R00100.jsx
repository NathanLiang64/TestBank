import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import { currencySymbolGenerator, stringDateCodeFormatter } from 'utilities/Generator';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import InformationTape from 'components/InformationTape';
import BottomAction from 'components/BottomAction';
import EmptyData from 'components/EmptyData';

import { getTransactions } from './api';
import PageWrapper from './R00100.style';

const endDate = new Date();
const startDate = new Date(endDate);
const limitDate = new Date(endDate);
startDate.setDate(endDate.getDate() - 15);
limitDate.setDate(endDate.getDate() - 60);

/**
 * R00100 信用卡 即時消費明細
 */
const Page = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [card, setCard] = useState();
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    if (startDate <= limitDate) return;
    startDate.setDate(startDate.getDate() - 15);
    endDate.setDate(endDate.getDate() - 15);
    const response = await getTransactions({
      accountNo: card.accountNo,
      startDate: stringDateCodeFormatter(startDate),
      endDate: stringDateCodeFormatter(endDate),
    });
    setTransactions([...transactions, ...response]);
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    let accountNo;
    if (location.state && ('accountNo' in location.state)) accountNo = location.state.accountNo;
    const response = await getTransactions({
      accountNo,
      startDate: stringDateCodeFormatter(startDate),
      endDate: stringDateCodeFormatter(endDate),
    });
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
                key={uuid()}
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
            <button type="button" onClick={() => fetchTransactions()}>Test Fetch</button>
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
