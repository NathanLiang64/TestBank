import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

/* Elements */
import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

import EmptySlide from './components/EmptySlide';
import EmptyPlan from './components/EmptyPlan';
import HeroSlide from './components/HeroSlide';

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
  <EmptyPlan />,
  <div key={uuid()} style={{ backgroundColor: '#ecc', height: 300 }}>a</div>,
  <div key={uuid()} style={{ backgroundColor: '#cec', height: 300 }}>b</div>,
];

const handler = (swiper) => {
  console.debug('onSlideChange', swiper);
};

/**
 * C00600 存錢計畫
 */
const DepositePlan = () => {
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

export default DepositePlan;
