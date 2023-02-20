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
import { RewardPageWrapper } from './C00700.style';

/**
 * C00700_2 信用卡 回饋
 */
const C007002 = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {state} = useLocation();
  const [rewards, setRewards] = useState();
  const [selectedMonth, setSelectedMonth] = useState(getThisMonth());

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    // TODO getRewards API 尚未有回傳資料
    const response = await getRewards();
    setRewards(response.data);
    dispatch(setWaittingVisible(false));
  }, []);

  const handleOnTabChange = (_, id) => {
    setSelectedMonth(id);
  };

  const renderSelectedReward = () => {
    if (!rewards) return null;
    // TODO 不確定 getRewards 回傳的 period 是什麼格式，有測資時可能會出錯，後續需要修改
    const foundReward = rewards.find((r) => r.period === selectedMonth);
    return foundReward ? (
      <>
        <Badge
          label={`${foundReward.date.slice(0, 4)}/${foundReward.date.slice(4, 6)} 回饋合計`}
          value={currencySymbolGenerator('NTD', foundReward.amount + foundReward.communityAmount)}
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
              <td>{currencySymbolGenerator('NTD', foundReward.amount)}</td>
            </tr>
            <tr>
              <td>社群圈分潤</td>
              <td>{currencySymbolGenerator('NTD', foundReward.communityAmount)}</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div className="font-14 mb-6">
          實際回饋金額以帳單為準
        </div>
      </>
    ) : (
      <EmptyData height="20rem" />
    );
  };

  const goBack = () => history.replace('/C00700', state.keepData);

  return (
    <Layout title="每月現金回饋" goBackFunc={goBack}>
      <Main>
        <RewardPageWrapper>
          <FEIBTabContext value={selectedMonth}>
            <FEIBTabList $size="small" $type="fixed" onChange={handleOnTabChange}>
              { getMonthList().map((m) => <FEIBTab key={uuid()} label={`${m.slice(4, 6)}月`} value={m} />)}
            </FEIBTabList>
          </FEIBTabContext>
          {renderSelectedReward()}
          <FEIBButton onClick={() => history.goBack()}>回信用卡首頁</FEIBButton>
        </RewardPageWrapper>
      </Main>
    </Layout>
  );
};

export default C007002;
