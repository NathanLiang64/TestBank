import styled from 'styled-components';
import { FormControlLabel as MaterialRadioLabel } from '@material-ui/core';

/*
* ==================== FEIBRadioLabel 可用選項 ====================
* 1. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為深藍灰色
* */

const FEIBRadioLabel = styled(MaterialRadioLabel)`
  color: ${({ theme, $color }) => $color || theme.colors.text.dark};

  // Label font size
  .MuiTypography-body1 {
    font-size: 1.6rem;
  }
  
  // Label position
  .MuiFormControlLabel-label {
    left: -.3rem;
  }

  // Icon font size
  .MuiSvgIcon-root {
    font-size: 2.4rem;
  }
`;

export default FEIBRadioLabel;
