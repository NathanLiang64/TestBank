import styled from 'styled-components';
import { Input as MaterialInput } from '@material-ui/core';
import { FEIBIconButton } from 'components/elements';

/*
* ==================== FEIBInput 可用選項 ====================
* 1. $fontSize -> 字級大小
*    直接填寫數字，例如：1.6，若未傳值預設為 1.4
* 2. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為主色
* 3. $borderColor -> 邊框顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為主色
* 4. $focusBorderColor -> 游標點擊後聚焦在物件時的邊框顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為主色
*    若已填寫 $borderColor 則直接繼承 $borderColor 色碼，也允許額外設定不同的色碼給此屬性
* 5. $bottomSpace -> 物件底部留白空間
*    預設為會預留固定高度，若不需要底部留白空間可將此屬性設置為 false
* 6. $icon -> 圖標
*    可傳入需要的圖標，顏色為淺主色，不可變更
* 7. $iconOnClick -> 點擊圖標的事件
*    可傳入點擊事件，若不傳事件則僅有不會觸發動作的圖標
* */

const FEIBInput = styled(MaterialInput).attrs(({ theme, $icon, $iconOnClick }) => ({
  endAdornment: (
    <FEIBIconButton onClick={$iconOnClick} $iconColor={theme.colors.primary.light}>
      {$icon}
    </FEIBIconButton>
  ),
}))`
  margin-top: .4rem;
  margin-bottom: ${({ $bottomSpace }) => ($bottomSpace === false && '0') || '2rem'};
  width: 100%;
  height: 3rem;

  .MuiInput-input {
    font-size: ${({ $fontSize }) => ($fontSize && `${$fontSize}rem`) || '1.4rem'};
    color: ${({ theme, $color }) => $color || theme.colors.primary.brand};
  }

  &.MuiInput-underline {
    &:before,
    &:hover:not(.Mui-disabled):before {
      border-color: ${({ theme, $borderColor }) => $borderColor || theme.colors.primary.brand};
      opacity: .6;
    }
    &:after {
      border-color: ${({ theme, $borderColor, $focusBorderColor }) => $focusBorderColor || $borderColor || theme.colors.primary.brand};
    }
  }
`;

export default FEIBInput;
