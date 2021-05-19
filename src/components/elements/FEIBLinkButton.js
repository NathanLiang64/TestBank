import styled from 'styled-components';
import FEIBdefaultButton from './_defaultElements/FEIBdefaultButton';

/*
* ==================== FEIBLinkButton 可用選項 ====================
* ===== FEIBLinkButton 之基礎樣式繼承於 FEIBdefaultButton 元件 ======
* 1. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* 2. $pressedColor -> 點擊連結後的文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
*    若已填寫 $color 則直接繼承 $color 色碼，也允許額外設定不同的色碼給此屬性
* */

const FEIBLinkButton = styled(FEIBdefaultButton).attrs({
  type: 'button',
})`
  min-width: unset;
  min-height: unset;
  width: auto;
  height: unset;
  border: 0;
  color: ${({ $color }) => $color || 'inherit'};
  background: transparent;
  
  &:hover {
     color: ${({ $color, $pressedColor }) => $pressedColor || $color || 'inherit'};
  }
`;

export default FEIBLinkButton;
