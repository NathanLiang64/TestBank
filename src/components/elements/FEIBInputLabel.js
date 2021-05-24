import styled from 'styled-components';
import { InputLabel as MaterialInputLabel } from '@material-ui/core';

/*
* ==================== FEIBInputLabel 可用選項 ====================
* 1. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為淺藍灰色
* */

const FEIBInputLabel = styled(MaterialInputLabel)`
  color: ${({ theme, $color }) => `${$color || theme.colors.text.light} !important`};
  //opacity: .6;
  
  &.MuiFormLabel-root {
    // Label font size
    font-size: 1.4rem;
  }
  
  &.MuiFormLabel-filled,
  &.Mui-focused {
    opacity: 1;
  }
`;

export default FEIBInputLabel;
