/* eslint react/no-array-index-key: 0 */

import { useRef, useState, useEffect } from 'react';
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
import Loading from 'components/Loading';

import { getTransactions } from './api';
import PageWrapper from './R00100.style';

const uid = uuid();
const endDate = new Date();
const startDate = new Date(endDate);
const limitDate = new Date(endDate);
startDate.setDate(endDate.getDate() - 14);
limitDate.setDate(endDate.getDate() - 60);

// 因為useState是async所以fetchTransactions時transactions有可能是空的
// 因此利用 backlog 變數暫存
let backlog = [];

/**
 * R00100 信用卡 即時消費明細
 */
const Page = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const loader = useRef();
  const [card, setCard] = useState();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const fetchTransactions = async () => {
    if (startDate <= limitDate) return;
    setIsLoading(true);
    startDate.setDate(startDate.getDate() - 15);
    endDate.setDate(endDate.getDate() - 15);

    const response = await getTransactions({
      accountNo: card?.accountNo,
      startDate: stringDateCodeFormatter(startDate),
      endDate: stringDateCodeFormatter(endDate),
    });
    backlog = backlog.concat(response);
    setTransactions(backlog);
    setIsLoading(false);
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
    backlog = backlog.concat(response);
    setTransactions(backlog);

    setCard({
      type: location?.state?.type,
      accountNo: location?.state?.accountNo,
      creditUsed: location?.state?.expenditure,
    });

    dispatch(setWaittingVisible(false));

    // 設定划到最下方時自動載入
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      if (isLoading) return;
      fetchTransactions();
    }, { threshold: 0 });
    observer.observe(loader.current);
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
            { transactions.length > 0 ? transactions.map((t, i) => (
              <InformationTape
                key={`${uid}-${i}`}
                topLeft={t.description}
                topRight={currencySymbolGenerator(t.currency ?? 'TWD', t.amount)}
                bottomLeft={`${t.txnDate.slice(4, 6)}/${t.txnDate.slice(6, 8)}`}
                bottomRight="TODO: 替換InformationTape+編輯元件"
              />
            )) : (
              <div style={{ height: '20rem', marginTop: '6rem' }}>
                <EmptyData />
              </div>
            )}
          </div>
          { isLoading && <Loading isCentered />}
          <div className="note">實際請款金額以帳單為準</div>
          <div className="loader" ref={loader} />
          <BottomAction>
            <button type="button">晚點付</button>
          </BottomAction>
        </PageWrapper>
      </MainScrollWrapper>
    </Layout>
  );
};

export default Page;
