import styled from 'styled-components';
import { ArrowDownIcon } from 'assets/images/icons';
import { Select as MaterialSelect } from '@material-ui/core';

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
* ==================== FEIBSelect 可用選項 ====================
* 1. $fontSize -> 字級大小
*    直接填寫數字，例如：1.6，若未傳值預設為 1.6
* 2. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為主色
* 3. $borderColor -> 邊框顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為淺灰色
* 4. $focusBorderColor -> 游標點擊後聚焦在物件時的邊框顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為淺主色
*    若已填寫 $borderColor 則直接繼承 $borderColor 色碼，也允許額外設定不同的色碼給此屬性
* 5. $iconColor -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為主色
* 6. $space -> 元件上下留白空間
*    預設無 margin，可傳入 "top"、"bottom"、"both" 字串來產生固定高度的 margin
* */

const FEIBSelect = styled(MaterialSelect).attrs({
  IconComponent: ({className}) => (className.includes('Mui-disabled') ? null : <ArrowDownIcon />),
})`
  height: 4rem;
  margin: ${({ $space }) => handleSpaceType($space)};
  width: 100%;
  
  .MuiSelect-select {
    // display: inline-flex; // inline-flex 會造成 text-overflow: ellipsis 無效
    display: block; 
    line-height: 1;
    color: ${({ theme, $color }) => $color || theme.colors.primary.dark};
    
    &.Mui-disabled{
      color: ${({ theme }) => theme.colors.text.lightGray};
    }
  }
  
  .MuiInputBase-input {
    padding-top: .8rem;
    padding-bottom: .8rem;
    font-size: ${({ $fontSize }) => ($fontSize && `${$fontSize}rem`) || '1.6rem'};
  }
  
  .MuiSelect-icon {
    top: 50%;
    transform: translateY(-50%);
  }

  .Icon {
    position: absolute;
    right: 1rem;
    font-size: 2rem;
    pointer-events: none;
  }
  
  &.MuiInput-underline {
    &:before,
    &:hover:not(.Mui-disabled):before {
      border-color: ${({ theme, $borderColor }) => $borderColor || theme.colors.border.light};
    }
    &:after {
      border-width: .1rem;
      border-color: ${({ theme, $borderColor, $focusBorderColor }) => $focusBorderColor || $borderColor || theme.colors.border.light};
    }
  }

  .Icon {
    color: ${({ theme, $iconColor }) => $iconColor || theme.colors.primary.brand} !important;
  }
`;

export default FEIBSelect;
