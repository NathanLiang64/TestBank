import styled from 'styled-components';
import { IconButton as MaterialIconButton } from '@material-ui/core';

/*
* ==================== FEIBIconButton 可用選項 ====================
* 1. $iconColor -> 圖標顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* 2. $fontSize -> 圖標字級大小
*    直接填寫數字，例如：2.4，若未傳值預設為 Material-UI 預設值 1.5
* */

const FEIBIconButton = styled(MaterialIconButton)`
  
  &.MuiIconButton-root {
    color: ${({ $iconColor }) => $iconColor || 'inherit'};
    
    .MuiSvgIcon-root {
      font-size: ${({ $fontSize }) => ($fontSize && `${$fontSize}rem`) || '1.5rem'};
    }
  }
`;

export default FEIBIconButton;
