import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import Badge from 'components/Badge';
import {
  FEIBButton, FEIBTabContext, FEIBTabList, FEIBTab,
} from 'components/elements';
import EmptyData from 'components/EmptyData';
import { currencySymbolGenerator } from 'utilities/Generator';
import { getThisMonth, getMonthList } from 'utilities/MonthGenerator';

import { getRewards } from './api';
import PageWrapper from './Rewards.style';

/**
 * C00700 信用卡 回饋
 */
const Page = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [rewards, setRewards] = useState();
  const [selectedMonth, setSelectedMonth] = useState(getThisMonth());
  const [displayReward, setDisplayReward] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    let accountNo;
    if (location.state && ('accountNo' in location.state)) accountNo = location.state.accountNo;
    const response = await getRewards({ accountNo });
    setRewards(response);
    setDisplayReward(response.find((r) => r.date === selectedMonth));
    dispatch(setWaittingVisible(false));
  }, []);

  const sumAmount = (reward) => reward.card + reward.social + reward.point;

  const handleOnTabChange = (_, id) => {
    setSelectedMonth(id);
    setDisplayReward(rewards.find((r) => r.date === id));
  };

  return (
    <Layout title="信用卡 回饋" goBackFunc={() => history.goBack()}>
      <Main>
        <PageWrapper>
          <FEIBTabContext value={selectedMonth}>
            <FEIBTabList $size="small" $type="fixed" onChange={handleOnTabChange}>
              { getMonthList().map((m) => <FEIBTab key={uuid()} label={`${m.slice(4, 6)}月`} value={m} />)}
            </FEIBTabList>
          </FEIBTabContext>
          { displayReward ? (
            <>
              <Badge
                label={`${displayReward.date.slice(0, 4)}/${displayReward.date.slice(4, 6)} 回饋合計`}
                value={currencySymbolGenerator(displayReward.currency ?? 'TWD', sumAmount(displayReward))}
              />
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-3/4">活動名稱</th>
                    <th className="w-1/4">金額</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>刷卡回饋</td>
                    <td>{currencySymbolGenerator(displayReward.currency ?? 'TWD', displayReward.card)}</td>
                  </tr>
                  <tr>
                    <td>社群圈分潤</td>
                    <td>{currencySymbolGenerator(displayReward.currency ?? 'TWD', displayReward.point)}</td>
                  </tr>
                </tbody>
              </table>
              <hr />
              <div className="font-14 mb-6">
                實際回饋金額以帳單為準
              </div>
            </>
          ) : (
            <div style={{ height: '20rem', marginTop: '6rem' }}>
              <EmptyData />
            </div>
          )}
          <FEIBButton onClick={() => history.goBack()}>回信用卡首頁</FEIBButton>
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
