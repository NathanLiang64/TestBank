import CopyTextIconButton from 'components/CopyTextIconButton';

import HeroSlideWrapper from './HeroSlide.style';
import mockBg from '../assets/mock-hero-bg.jpg';

/*
* ==================== HeroSlide 組件說明 ====================
* 存錢計畫的上方卡片。
* ==================== HeroSlide 可傳參數 ====================
* 1. imgSrc -> 背景圖網址。
* 2. imgAlt -> 背景圖敘述。
* 3. title -> 標題。
* 4. account -> 帳戶號。
* */

const HeroSlide = ({
  imgSrc = mockBg,
  imgAlt = '',
  title = '未命名計畫',
  account = '000-000-99001234',
}) => (
  <HeroSlideWrapper>
    <div className="toolkits">
      <img src={imgSrc} alt={imgAlt} />
    </div>
    <div className="title">{title}</div>
    <div className="account">
      {account}
      <CopyTextIconButton copyText={account} isInline />
    </div>
  </HeroSlideWrapper>
);

export default HeroSlide;
