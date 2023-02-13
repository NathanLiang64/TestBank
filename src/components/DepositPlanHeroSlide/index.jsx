import CopyTextIconButton from 'components/CopyTextIconButton';
import FEIBRoundButton from 'components/elements/FEIBRoundButton';
import { MoreIcon, EditIcon } from 'assets/images/icons';
import { accountFormatter, currencySymbolGenerator } from 'utilities/Generator';

import BG1 from 'assets/images/deposit-plan/hero-1@2x.jpg';
import BG2 from 'assets/images/deposit-plan/hero-2@2x.jpg';
import BG3 from 'assets/images/deposit-plan/hero-3@2x.jpg';
import BG4 from 'assets/images/deposit-plan/hero-4@2x.jpg';
import BG5 from 'assets/images/deposit-plan/hero-5@2x.jpg';
import BG6 from 'assets/images/deposit-plan/hero-6@2x.jpg';

import DepositPlanHeroSlideWrapper from './DepositPlanHeroSlide.style';

/*
* ==================== HeroSlide 組件說明 ====================
* 存錢計畫的上方卡片。
* ==================== HeroSlide 可傳參數 ====================
* 1. planId -> 當 imageId 為0時，會使用 planId 抓背景圖。
* 2. imageId -> 選擇背景圖。
* 3. name -> 標題。
* 4. accountNo -> 帳戶號。
* 5. balance -> 金額。
* 6. isSimple -> 用於存錢歷程。
* 7. dollarSign -> 資產貨幣。
* 8. onMoreClicked -> 當「更多」按鈕觸發。
* 9. onEditClicked -> 當「編輯」按鈕觸發。
* */

const DepositPlanHeroSlide = ({
  planId,
  imageId,
  name,
  accountNo,
  balance,
  dollarSign = 'NTD',
  isSimple,
  onMoreClicked,
  onEditClicked,
}) => {
  const imgSrc = () => {
    switch (imageId) {
      case 0:
        return `${process.env.REACT_APP_DEPOSIT_PLAN_IMG_URL}/${planId}.jpg`;
      case 2:
        return BG2;
      case 3:
        return BG3;
      case 4:
        return BG4;
      case 5:
        return BG5;
      case 6:
        return BG6;
      case 1:
      default:
        return BG1;
    }
  };

  return (
    <DepositPlanHeroSlideWrapper $shouldExtend={isSimple}>
      <div className="toolkits">
        { isSimple && (
        <div className="overlay">
          <div>{ name }</div>
          <div>{ accountFormatter(accountNo, true) }</div>
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
        <img src={imgSrc()} alt="" />
      </div>
      { !isSimple && (
      <>
        <div className="title">{name}</div>
        <div className="account">
          { accountFormatter(accountNo, true) }
          <CopyTextIconButton copyText={accountNo} isInline />
        </div>

      </>
      ) }
    </DepositPlanHeroSlideWrapper>
  );
};

export default DepositPlanHeroSlide;
