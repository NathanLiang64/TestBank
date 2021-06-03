import styled from 'styled-components';
import { Radio as MaterialRadio } from '@material-ui/core';

/*
* ==================== FEIBRadio 可用選項 ====================
* 1. $iconColor -> 圖標顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設深藍灰色
* */

const FEIBRadio = styled(MaterialRadio).attrs({
  color: 'default',
})`
  &.MuiRadio-root {
    color: ${({ theme, $iconColor }) => $iconColor || theme.colors.text.dark};
  }
`;

export default FEIBRadio;
