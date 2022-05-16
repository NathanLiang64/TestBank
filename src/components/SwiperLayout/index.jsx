/* eslint no-underscore-dangle: ["error", {"allow": ["_slides", "_children"] }] */

import React, { useState } from 'react';
import SwiperCore, { Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import uuid from 'react-uuid';

import SwiperLayoutWrapper from './SwiperLayout.style';
import { templateSlides, templateContents } from './templates';

/*
* ==================== SwiperLayout 組件說明 ====================
* 適用於上方Swiper，下方內容之版型，如「存錢計畫」。
* 有兩種使用情境：
*   1、如果參數 slides 和 children 皆為 array，且 length 一致，
*      本元件會自動切換對應的 children。
*    或
*   2、如果單一 children，便需自行管理其內容。可用 onSlideChange hook。
* ==================== SwiperLayput 可傳參數 ====================
* 1. slides: (array | React.Fragment) -> 上方 swiper 的 slides。
* 2. children: (array | React.Fragment) -> 下方內容。
* 3. hasDivider: boolean -> 顯示中間分隔線。
* 4. onSlideChange: function -> 當切換 slide 時會呼叫。
* 5. swiperParameters: any -> 其餘的參數會傳給 Swiper，請參考 Swiper API。
* */

SwiperCore.use([Pagination]);

const SwiperLayout = ({
  slides,
  children,
  hasDivider = true,
  onSlideChange,
  ...swiperParameters
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  let _slides = slides ?? templateSlides;
  let _children = children ?? templateContents;

  if (!Array.isArray(_slides)) {
    _slides = [_slides];
  }

  if (!Array.isArray(_children)) {
    _children = React.Children.toArray(_children);
  }

  const shouldHandelSlideChange = _children.length > 1
    && _children.length === _slides.length;

  const handleSlideChange = (swiper) => {
    if (shouldHandelSlideChange) {
      setActiveIndex(swiper.realIndex);
    }
    onSlideChange(swiper);
  };

  return (
    <SwiperLayoutWrapper>
      <Swiper
        pagination
        onSlideChange={handleSlideChange}
        {...swiperParameters}
      >
        { _slides.map((slide) => (
          <SwiperSlide key={uuid()}>{slide}</SwiperSlide>
        )) }
      </Swiper>
      { hasDivider && <hr /> }
      { shouldHandelSlideChange ? _children[activeIndex] : children }
    </SwiperLayoutWrapper>
  );
};

export default SwiperLayout;
