import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import uuid from 'react-uuid';

import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import PieChart from 'components/PieChart';

// import { getBalanceInfo } from './api';
import { mockData } from './mockData';
import AccountCardList from './components/AccountCardList';

const renderSlides = (data) => {
  const slides = [];

  if (data?.assets && data.assets.length > 0) {
    slides.push(<PieChart key={uuid()} label="正資產" data={data.assets} space="top" isCentered />);
  }

  if (data?.debts && data.debts.length > 0) {
    slides.push(<PieChart key={uuid()} label="負資產" data={data.debts} space="top" isCentered />);
  }

  return slides;
};

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
 * C00100 帳戶總覽頁
 */
const AccountOverviewPage = () => {
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState(undefined);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 頁面切換呼叫 startFunc 之時在 AccountCardList 元件內，
    // 該元件無完整資訊，故另外管理 sessionStorage。
    // 且 startFunc 會強制改寫URL，導致頁面重新載入，故無法善用 Redux。
    const sessionCache = sessionStorage.getItem('C00100');

    if (sessionCache) {
      setAccounts(JSON.parse(sessionCache));
    } else {
      // const response = getBalanceInfo();
      const response = mockData;

      setAccounts(response);
      sessionStorage.setItem('C00100', JSON.stringify(response));
    }

    dispatch(setWaittingVisible(false));
  }, []);

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
