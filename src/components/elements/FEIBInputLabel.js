import styled from 'styled-components';
import { InputLabel as MaterialInputLabel } from '@material-ui/core';

/*
* ==================== FEIBInputLabel 可用選項 ====================
* 1. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* */

const FEIBInputLabel = styled(MaterialInputLabel)`
  color: ${({ $color }) => `${$color} !important` || 'inherit'};
  //opacity: .6;

  &.MuiFormLabel-filled,
  &.Mui-focused {
    opacity: 1;
  }
`;

export default FEIBInputLabel;
