import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import uuid from 'react-uuid';
import { Func } from 'utilities/FuncID';

import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import PieChart from 'components/PieChart';

import { getBalanceInfo } from './api';
import AccountCardList from './components/AccountCardList';

/**
 * C00100 帳戶總覽頁
 */
const AccountOverviewPage = () => {
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getBalanceInfo();
    setAccounts(response);
    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 產生上方圓餅圖的 slides
   * 因為第一階段可能沒有負資產的功能，所以預設空陣列，仰賴後端回傳的資料，再將其加入陣列中。
   * 正資產子帳戶只顯示『存錢計畫』
   * TODO: 空陣列時？
   */
  const renderSlides = (data) => {
    const slides = [];

    if (data?.assets && data.assets.length > 0) {
      // 正資產陣列移除子帳戶項目
      const assetList = data.assets.filter((account) => account.type !== 'C');
      // 子帳戶項目篩選只餘『存錢計畫』
      const subAccounts = data.assets.filter((account) => account.type === 'C' && account.purpose === 2);
      // 篩選後子項目加回正資產陣列
      if (subAccounts.length > 0) assetList.push(...subAccounts);

      slides.push(<PieChart key={uuid()} label="正資產" data={assetList.sort((a, b) => b.balance - a.balance)} isCentered />);
    }

    if (data?.debts && data.debts.length > 0) {
      slides.push(<PieChart key={uuid()} label="負資產" data={data.debts.sort((a, b) => b.balance - a.balance)} isCentered />);
    }

    return slides;
  };

  /**
   * 產生下方帳戶資訊的 slides
   * 處理方式同上
   */
  const renderContents = (data) => {
    const slides = [];

    if (data?.assets && data.assets.length > 0) {
      slides.push(<AccountCardList key={uuid()} data={data.assets} isDebt={false} necessaryType={['M', 'F', 'S', 'C']} />);
    }

    if (data?.debts && data.debts.length > 0) {
      slides.push(<AccountCardList key={uuid()} data={data.debts} isDebt necessaryType={['CC', 'L']} />);
    }

    return slides;
  };

  /**
   * 產生頁面
   * 只要提供相同數量的 slides 和 content，SwiperLayout會自動切換對應的內容。
   */
  return (
    <Layout fid={Func.C001} title="帳戶總覽">
      <Main>
        <SwiperLayout slides={renderSlides(accounts)} hasDivider={false}>
          { renderContents(accounts) }
        </SwiperLayout>
      </Main>
    </Layout>
  );
};

export default AccountOverviewPage;
