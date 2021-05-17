import styled from 'styled-components';
import FEIBdefaultButton from './_defaultElements/FEIBdefaultButton';

/*
* ==================== FEIBButton 可用選項 ====================
* ===== FEIBButton 之基礎樣式繼承於 FEIBdefaultButton 元件 ======
* 1. $fontSize -> 字級大小
*    直接填寫數字，例如：1.6，若未傳值預設為 1.4
* 2. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* 3. $bgColor -> 背景顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* 4. $pressedBgColor -> 游標懸停在物件時的背景顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
*    若已填寫 $bgColor 則直接繼承 $bgColor 色碼，也允許額外設定不同的色碼給此屬性
* 5. $width -> 按鈕寬度
*    直接填寫數字，例如：12，若未傳值預設為 100%，最小限制 4.8
* 6. $height -> 按鈕高度
*    直接填寫數字，例如：4，若未傳值預設為 3.6，最小限制 3.2
* */

const FEIBButton = styled(FEIBdefaultButton)`
  background: ${({ $bgColor }) => $bgColor || 'transparent'};
  
  &:hover {
    background: ${({ $bgColor, $pressedBgColor }) => $pressedBgColor || $bgColor || 'inherit'};
  }
`;

export default FEIBButton;
