/* eslint react/no-array-index-key: 0 */

import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import Badge from 'components/Badge';
import InformationList from 'components/InformationList';
import EmptyData from 'components/EmptyData';
import {
  dateFormatter, stringToDate, currencySymbolGenerator,
} from 'utilities/Generator';

import { getLoanRewards } from './api';
import PageWrapper from './Rewards.style';

const uid = uuid();

/**
 * L00100 貸款 可能回饋頁
 */
const Page = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [rewards, setRewards] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    let accountNo;
    if (location.state && ('accountNo' in location.state)) accountNo = location.state.accountNo;
    const response = await getLoanRewards({ accountNo });
    setRewards(response);
    dispatch(setWaittingVisible(false));
  }, []);

  const renderTransactions = (transactions) => transactions.map((t, i) => (
    <InformationList
      key={`${uid}-${i}`}
      title={dateFormatter(stringToDate(t.txnDate))}
      content={t.isSuccess ? `利息金額 ${currencySymbolGenerator(t.currency ?? 'TWD', t.amount)}` : '當日扣款失敗'}
      remark={t.isSuccess ? `${t.rate}%利息 ${currencySymbolGenerator(t.currency ?? 'TWD', Math.round(t.amount * (t.rate / 100)))}` : '挑戰失敗'}
    />
  ));

  return (
    <Layout title="可能回饋" goBackFunc={() => history.goBack()}>
      <Main small>
        <PageWrapper>
          <Badge
            label={rewards?.isJoinedRewardProgram ? '可能回饋' : '您尚未參加挑戰'}
            value={rewards?.isJoinedRewardProgram ? currencySymbolGenerator(rewards?.currency ?? 'NTD', rewards?.rewards ?? 0) : '-'}
          />
          { rewards?.transactions?.length > 0 ? (
            renderTransactions(rewards.transactions)
          ) : (
            <div style={{ height: '20rem', marginTop: '6rem' }}>
              <EmptyData />
            </div>
          ) }
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
