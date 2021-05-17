import styled from 'styled-components';
import { FormControlLabel as MaterialCheckboxLabel } from '@material-ui/core';

/*
* ==================== FEIBCheckboxLabel 可用選項 ====================
* 1. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* */

const FEIBCheckboxLabel = styled(MaterialCheckboxLabel)`
  color: ${({ $color }) => $color || 'inherit'};
`;

export default FEIBCheckboxLabel;
