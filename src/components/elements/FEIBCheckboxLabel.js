import styled from 'styled-components';
import { FormControlLabel as MaterialCheckboxLabel } from '@material-ui/core';

/*
* ==================== FEIBCheckboxLabel 可用選項 ====================
* 1. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設淺藍灰色
* */

const FEIBCheckboxLabel = styled(MaterialCheckboxLabel)`
  color: ${({ theme, $color }) => $color || theme.colors.text.light};
`;

export default FEIBCheckboxLabel;
