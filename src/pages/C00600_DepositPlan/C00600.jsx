import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

import EmptySlide from './components/EmptySlide';
import EmptyPlan from './components/EmptyPlan';
import HeroSlide from './components/HeroSlide';
import DepositPlan from './components/DepositPlan';

const renderSlides = (slides) => {
  const plans = Array.from({ length: 3 }, () => <EmptySlide />);

  if (slides) {
    slides.forEach((s, i) => {
      plans[i] = <HeroSlide {...s} />;
    });
  }

  return plans;
};

const contents = [
  <DepositPlan />,
  <DepositPlan currentValue={75} />,
  <EmptyPlan />,
];

const handler = (swiper) => {
  console.debug('onSlideChange', swiper);
};

/**
 * C00600 存錢計畫
 */
const DepositPlanPage = () => {
  const dispatch = useDispatch();
  const [slides, setSlides] = useState(undefined);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // Fetch API...
    setTimeout(() => {
      setSlides([
        { title: '計畫1' },
        { title: '計畫2' },
      ]);
    }, 500);

    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="存錢計畫" hasClearHeader>
      <SwiperLayout height={200} slides={renderSlides(slides)} onSlideChange={handler}>
        { contents }
      </SwiperLayout>
    </Layout>
  );
};

export default DepositPlanPage;
