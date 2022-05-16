import SwiperCore, { Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';

SwiperCore.use([Pagination]);

const SwiperLayout = ({
  height = 300,
  children,
}) => (
  <>
    <Swiper pagination style={{ height }}>
      <SwiperSlide>
        <div style={{ height: 100, backgroundColor: 'red' }}>A</div>
      </SwiperSlide>
      <SwiperSlide>
        <div style={{ height: 100, backgroundColor: 'green' }}>B</div>
      </SwiperSlide>
    </Swiper>
    <div style={{ backgroundColor: 'grey' }}>
      {children}
    </div>
  </>
);

export default SwiperLayout;
