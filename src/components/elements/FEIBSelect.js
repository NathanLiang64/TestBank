import styled from 'styled-components';
import { Select as MaterialSelect } from '@material-ui/core';

/*
* ==================== FEIBSelect 可用選項 ====================
* 1. $fontSize -> 字級大小
*    直接填寫數字，例如：1.6，若未傳值預設為 1.4
* 2. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* 3. $borderColor -> 邊框顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* 4. $focusBorderColor -> 游標點擊後聚焦在物件時的邊框顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
*    若已填寫 $borderColor 則直接繼承 $borderColor 色碼，也允許額外設定不同的色碼給此屬性
* * 5. $bottomSpace -> 物件底部留白空間
*    預設為會預留固定高度，若不需要底部留白空間可將此屬性設置為 false
* */

const FEIBSelect = styled(MaterialSelect)`
  min-height: 3.6rem;
  margin-bottom: ${({ $bottomSpace }) => ($bottomSpace === false && '0') || '1.6rem'};
  width: 100%;
  
  .MuiSelect-select {
    display: inline-flex;
    align-items: center;
    color: ${({ $color }) => $color || 'inherit'};
    font-size: ${({ $fontSize }) => ($fontSize && `${$fontSize}rem`) || '1.4rem'};
  }
  
  .MuiSelect-icon {
    top: 50%;
    transform: translateY(-50%);
  }
  
  &.MuiInput-underline {
    &:before,
    &:hover:not(.Mui-disabled):before {
      border-color: ${({ $borderColor }) => $borderColor || 'inherit'};
      opacity: .6;
    }
    &:after {
      border-color: ${({ $borderColor, $focusBorderColor }) => $focusBorderColor || $borderColor || 'inherit'};
    }
  }
`;

export default FEIBSelect;
