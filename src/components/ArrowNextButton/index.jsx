import { ArrowNextIcon } from 'assets/images/icons';

import ArrowNextButtonWrapper from './ArrowNextButton.style';

/*
* ==================== ArrowNextButton 組件說明 ====================
* 按鈕加箭頭
* ==================== ArrowNextButton 可傳參數 ====================
* 1. align: ('left' | 'center' | 'right') -> CSS text-align
* 2. onClick -> 點擊呼叫
* 3. arialLabel: string
* 4. disabled: boolean
* 5. children -> 顯示文字，不須設置 children 屬性，直接在標籤內部填寫文字
* */

const ArrowNextButton = ({
  align = 'right',
  onClick,
  arialLabel,
  disabled,
  children,
}) => (
  <ArrowNextButtonWrapper $align={align}>
    <button
      type="button"
      onClick={onClick}
      title={arialLabel ?? children}
      disabled={disabled}
    >
      {children}
      <ArrowNextIcon />
    </button>
  </ArrowNextButtonWrapper>
);

export default ArrowNextButton;
