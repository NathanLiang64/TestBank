import CopyTextIconButton from 'components/CopyTextIconButton';
import FEIBRoundButton from 'components/elements/FEIBRoundButton';
import { MoreIcon, EditIcon } from 'assets/images/icons';
import { accountFormatter, currencySymbolGenerator } from 'utilities/Generator';

import mockBg from 'assets/mock-hero-bg.jpeg';
import DepositPlanHeroSlideWrapper from './DepositPlanHeroSlide.style';

/*
* ==================== HeroSlide 組件說明 ====================
* 存錢計畫的上方卡片。
* ==================== HeroSlide 可傳參數 ====================
* 1. imgSrc -> 背景圖網址。
* 2. imgAlt -> 背景圖敘述。
* 3. title -> 標題。
* 4. account -> 帳戶號。
* 5. onMoreClicked -> 當「更多」按鈕觸發。
* 6. onEditClicked -> 當「編輯」按鈕觸發。
* 7. isSimple -> 用於存錢歷程。
* 8. balance -> 金額。
* 9. dollarSign -> 資產貨幣。
* */

const DepositPlanHeroSlide = ({
  imgSrc = mockBg,
  imgAlt = '',
  title = '未命名計畫',
  account = '00000099001234',
  onMoreClicked,
  onEditClicked,
  isSimple,
  balance,
  dollarSign = 'NTD',
}) => (
  <DepositPlanHeroSlideWrapper>
    <div className="toolkits">
      { isSimple && (
        <div className="overlay">
          <div>{ title }</div>
          <div>{ accountFormatter(account) }</div>
          <div className="balance">{ currencySymbolGenerator(dollarSign, balance) }</div>
        </div>
      ) }
      { !isSimple && (
        <div className="group">
          <FEIBRoundButton aria-label="展開下拉式選單" onClick={onMoreClicked}>
            <MoreIcon />
          </FEIBRoundButton>
          <FEIBRoundButton aria-label="編輯計畫內容" onClick={onEditClicked}>
            <EditIcon />
          </FEIBRoundButton>
        </div>
      ) }
      <img src={imgSrc} alt={imgAlt} />
    </div>
    { !isSimple && (
      <>
        <div className="title">{title}</div>
        <div className="account">
          { accountFormatter(account) }
          <CopyTextIconButton copyText={account} isInline />
        </div>

      </>
    ) }
  </DepositPlanHeroSlideWrapper>
);

export default DepositPlanHeroSlide;
