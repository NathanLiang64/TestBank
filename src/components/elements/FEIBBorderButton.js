import styled from 'styled-components';
import FEIBdefaultButton from './_defaultElements/FEIBdefaultButton';
/*
* ==================== FEIBBorderButton 可用選項 ====================
* ===== FEIBBorderButton 之基礎樣式繼承於 FEIBdefaultButton 元件 ======
* 1. $fontSize -> 字級大小
*    直接填寫數字，例如：1.6，若未傳值預設為 1.4
* 2. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為深主色
* 3. $borderColor -> 邊框顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* 5. $width -> 按鈕寬度
*    直接填寫數字，例如：12，若未傳值預設為 100%，最小限制 4.8
* 6. $height -> 按鈕高度
*    直接填寫數字，例如：4，若未傳值預設為 3.6，最小限制 3.2
* */

const FEIBBorderButton = styled(FEIBdefaultButton)`
  border: .1rem solid ${({ theme, $borderColor }) => $borderColor || theme.colors.primary.light};
  color: ${({ theme, $color }) => $color || theme.colors.primary.light};
  
  ${({ isSelected, theme, $borderColor }) => (isSelected
    ? `
    background: ${$borderColor || theme.colors.primary.light};
    color: ${theme.colors.basic.white};
    &:before {
      opacity: .16;
    }
    ` : 'background: transparent')}

  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    border: .1rem solid ${({ $borderColor }) => $borderColor};
    border-radius: 2.4rem;
    width: calc(100% - .1rem);
    height: calc(100% - .1rem);
    background: ${({ $borderColor }) => $borderColor};
    transition: all .2s;
    opacity: 0;
  }
`;

export default FEIBBorderButton;
