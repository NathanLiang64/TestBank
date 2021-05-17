/* Elements */
import { FEIBButton, FEIBBorderButton } from 'components/elements';

/* Styles */
import theme from 'themes/theme';
import ConfirmButtonsWrapper from './confirmButtons.style';

/*
* ==================== ConfirmButtons 組件說明 ====================
* 封裝了 1 個主要按鈕和 1 個次要按鈕，不可改變按鈕數量、樣式及排列順序
* 此組件旨在快速套用於諸多頁面，若有設定樣式之需求請分別匯入不同的按鈕元件
* ==================== ConfirmButtons 可傳參數 ====================
* 1. mainButtonValue -> 主要按鈕的顯示文字，預設為 "確定"
* 2. mainButtonOnClick -> 主要按鈕點擊後觸發的事件
* 3. subButtonValue -> 次要按鈕的顯示文字，預設為 "取消"
* 4. subButtonOnClick -> 次要按鈕點擊後觸發的事件
* */

const ConfirmButtons = ({
  mainButtonValue,
  mainButtonOnClick,
  subButtonValue,
  subButtonOnClick,
}) => (
  <ConfirmButtonsWrapper>
    <FEIBBorderButton
      $borderColor={theme.colors.primary.brand}
      $color={theme.colors.primary.dark}
      onClick={subButtonOnClick}
    >
      {subButtonValue || '取消'}
    </FEIBBorderButton>
    <FEIBButton
      $bgColor={theme.colors.primary.brand}
      $pressedBgColor={theme.colors.primary.dark}
      $color={theme.colors.basic.white}
      onClick={mainButtonOnClick}
    >
      {mainButtonValue || '確定'}
    </FEIBButton>
  </ConfirmButtonsWrapper>
);

export default ConfirmButtons;
