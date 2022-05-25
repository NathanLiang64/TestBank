import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import uuid from 'react-uuid';

import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import PieChart from 'components/PieChart';

import { getBalanceInfo } from './api';
// import { mockData } from './mockData';
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

    const response = await getBalanceInfo();
    console.debug('getBalanceInfo', response);
    // const response = mockData;

    setAccounts(response);

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
