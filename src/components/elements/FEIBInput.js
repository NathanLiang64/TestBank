import styled from 'styled-components';
import { Input as MaterialInput } from '@material-ui/core';
import { FEIBIconButton } from 'components/elements';

const handleSpaceType = (position) => {
  switch (position) {
    case 'top':
      return '2rem 0 0 0';
    case 'bottom':
      return '0 0 2rem 0';
    case 'both':
      return '2rem 0';
    default:
      return '0';
  }
};

/*
* ==================== FEIBInput 可用選項 ====================
* 1. $fontSize -> 字級大小
*    直接填寫數字，例如：1.6，若未傳值預設為 1.6
* 2. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為淺主色
* 3. $borderColor -> 邊框顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為淺灰色
* 4. $focusBorderColor -> 游標點擊後聚焦在物件時的邊框顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為淺主色
*    若已填寫 $borderColor 則直接繼承 $borderColor 色碼，也允許額外設定不同的色碼給此屬性
* 5. $space -> 元件上下留白空間
*    預設無 margin，可傳入 "top"、"bottom"、"both" 字串來產生固定高度的 margin
* 6. $icon -> 圖標
*    可傳入需要的圖標，顏色為淺主色，不可變更
* 7. $iconFontSize -> 圖標字級大小
*    直接填寫數字，例如：2.4，若未傳值預設為 Material-UI 預設值 1.5
* 8. $iconOnClick -> 點擊圖標的事件
*    可傳入點擊事件，若不傳事件則僅有不會觸發動作的圖標
* */

const FEIBInput = styled(MaterialInput).attrs(({
  theme, $icon, $iconOnClick, $iconFontSize,
}) => $icon && ({
  endAdornment: (
    <FEIBIconButton
      onClick={$iconOnClick}
      $iconColor={theme.colors.primary.light}
      $fontSize={$iconFontSize}
    >
      {$icon}
    </FEIBIconButton>
  ),
}))`
  margin: ${({ $space }) => handleSpaceType($space)};
  width: 100%;
  height: 4rem;

  .MuiInput-input {
    padding-top: .8rem;
    padding-bottom: .8rem;
    font-size: ${({ $fontSize }) => ($fontSize && `${$fontSize}rem`) || '1.6rem'};
    color: ${({ theme, $color }) => $color || theme.colors.primary.dark};
    
    &:disabled{
      color: ${({ theme }) => theme.colors.text.lightGray};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.placeholder};
      opacity: 1;
    }
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0; 
    }

    &[type=number] {
      -moz-appearance:textfield;
    }
  }

  &.MuiInput-underline {
    &:before,
    &:hover:not(.Mui-disabled):before {
      border-color: ${({ theme, $borderColor }) => $borderColor || theme.colors.border.light};
      //opacity: .6;
    }
    &:after {
      border-width: .1rem;
      border-color: ${({ theme, $borderColor, $focusBorderColor }) => $focusBorderColor || $borderColor || theme.colors.border.light};
    }

    &.Mui-error:after {
      border-width: .1rem;
      border-color: ${({ theme }) => theme.colors.state.danger};
    }
  }
  
  // 銀行代碼 List Icon
  .listIcon {
    right: -.4rem;
    font-size: 2rem;
  }
`;

export default FEIBInput;
