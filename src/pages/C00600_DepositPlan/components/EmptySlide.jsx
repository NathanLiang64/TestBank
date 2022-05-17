import { AccountIcon6 } from 'assets/images/icons';

import EmptySlideWrapper from './EmptySlide.style';

/*
* ==================== EmptySlide 組件說明 ====================
* 存錢計畫的上方卡片，當沒計畫時使用。
* ==================== EmptySlide 可傳參數 ====================
* 1. title -> 標題。
* 2. slogan -> 標語。
* */

const EmptySlide = ({
  title = '存錢計畫',
  slogan = '開始進行存錢計畫吧！',
}) => (
  <EmptySlideWrapper>
    <AccountIcon6 size={54} color="currentColor" />
    <h2 className="title">{title}</h2>
    <p className="slogan">{slogan}</p>
  </EmptySlideWrapper>
);

export default EmptySlide;
