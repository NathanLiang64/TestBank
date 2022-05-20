import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import AccountCard from 'components/AccountCard';

const renderSlides = () => {
  const slides = [
    <div>A</div>,
    <div>B</div>,
  ];
  return slides;
};

const renderContents = () => {
  const slides = [
    <AccountCard />,
    <AccountCard />,
  ];
  return slides;
};

/**
 * C00100 帳戶總覽
 */
const AccountOverviewPage = () => {
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    // FATCH API
    dispatch(setWaittingVisible(false));
  });

  return (
    <Layout title="帳戶總覽">
      <SwiperLayout slides={renderSlides()}>
        { renderContents() }
      </SwiperLayout>
    </Layout>
  );
};

export default AccountOverviewPage;
