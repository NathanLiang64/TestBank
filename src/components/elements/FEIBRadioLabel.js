import styled from 'styled-components';
import { FormControlLabel as MaterialRadioLabel } from '@material-ui/core';

/*
* ==================== FEIBRadioLabel 可用選項 ====================
* 1. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* */

const FEIBRadioLabel = styled(MaterialRadioLabel)`
  color: ${({ $color }) => $color || 'inherit'};
`;

export default FEIBRadioLabel;
