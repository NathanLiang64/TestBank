import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
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
 * C00700_2 信用卡 回饋
 */
const C007002 = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [rewards, setRewards] = useState();
  const [selectedMonth, setSelectedMonth] = useState(getThisMonth());

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    // TODO getRewards API 尚未有回傳資料
    const response = await getRewards();
    setRewards(response.data);
    dispatch(setWaittingVisible(false));
  }, []);

  const sumAmount = (reward) => reward.card + reward.social + reward.point;

  const handleOnTabChange = (_, id) => {
    setSelectedMonth(id);
  };

  const renderSelectedReward = () => {
    if (!rewards) return null;
    const selcetedReward = rewards.find((r) => r.date === selectedMonth);
    return selcetedReward ? (
      <>
        <Badge
          label={`${selcetedReward.date.slice(0, 4)}/${selcetedReward.date.slice(4, 6)} 回饋合計`}
          value={currencySymbolGenerator(selcetedReward.currency ?? 'TWD', sumAmount(selcetedReward))}
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
              <td>{currencySymbolGenerator(selcetedReward.currency ?? 'TWD', selcetedReward.card)}</td>
            </tr>
            <tr>
              <td>社群圈分潤</td>
              <td>{currencySymbolGenerator(selcetedReward.currency ?? 'TWD', selcetedReward.point)}</td>
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
    );
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
          {renderSelectedReward()}
          <FEIBButton onClick={() => history.goBack()}>回信用卡首頁</FEIBButton>
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default C007002;
