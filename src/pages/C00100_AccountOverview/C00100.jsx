import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import uuid from 'react-uuid';

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
  const [accounts, setAccounts] = useState(undefined);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getBalanceInfo();
    setAccounts(response);
    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 產生上方圓餅圖的 slides
   * 因為第一階段可能沒有負資產的功能，所以預設空陣列，仰賴後端回傳的資料，再將其加入陣列中。
   */
  const renderSlides = (data) => {
    const slides = [];

    if (data?.assets && data.assets.length > 0) {
      slides.push(<PieChart key={uuid()} label="正資產" data={data.assets} isCentered />);
    }

    if (data?.debts && data.debts.length > 0) {
      slides.push(<PieChart key={uuid()} label="負資產" data={data.debts} isCentered />);
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
      slides.push(<AccountCardList key={uuid()} data={data.assets} />);
    }

    if (data?.debts && data.debts.length > 0) {
      slides.push(<AccountCardList key={uuid()} data={data.debts} />);
    }

    return slides;
  };

  /**
   * 產生頁面
   * 只要提供相同數量的 slides 和 content，SwiperLayout會自動切換對應的內容。
   */
  return (
    <Layout title="帳戶總覽">
      <Main>
        <SwiperLayout slides={renderSlides(accounts)} hasDivider={false}>
          { renderContents(accounts) }
        </SwiperLayout>
      </Main>
    </Layout>
  );
};

export default AccountOverviewPage;
