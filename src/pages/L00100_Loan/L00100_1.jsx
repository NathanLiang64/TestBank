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
  dateToString, currencySymbolGenerator,
} from 'utilities/Generator';

import { getLoanRewards } from './api';
import { RewardPageWrapper } from './L00100.style';

const uid = uuid();

/**
 * L00100_1 貸款 可能回饋頁
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
    <li key={`${uid}-${i}`}>
      <InformationList
        title={dateToString(t.txnDate)}
        content={t.isSuccess ? `利息金額 ${currencySymbolGenerator(t.currency ?? 'NTD', t.amount)}` : '當日扣款失敗'}
        remark={t.isSuccess ? `${t.rate}%利息 ${currencySymbolGenerator(t.currency ?? 'NTD', Math.round(t.amount * (t.rate / 100)))}` : <span className="text-red">挑戰失敗</span>}
      />
    </li>
  ));

  return (
    <Layout title="可能回饋" goBackFunc={() => history.goBack()}>
      <Main small>
        <RewardPageWrapper>
          <Badge
            label={rewards?.isJoinedRewardProgram ? '回饋累計' : '您尚未參加挑戰'}
            value={rewards?.isJoinedRewardProgram ? currencySymbolGenerator(rewards?.currency ?? 'NTD', rewards?.rewards ?? 0) : '-'}
          />
          { rewards?.transactions?.length > 0 ? (
            <div>
              <h2>扣款明細</h2>
              <ul>
                {renderTransactions(rewards.transactions)}
              </ul>
            </div>
          ) : (
            <EmptyData height="30vh" />
          ) }
        </RewardPageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
