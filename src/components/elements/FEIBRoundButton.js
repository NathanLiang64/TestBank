import styled from 'styled-components';
import { IconButton as MaterialIconButton } from '@material-ui/core';

/*
* ==================== FEIBRoundButton 可用選項 ====================
* 1. $iconColor -> 圖標顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* 2. $fontSize -> 圖標字級大小
*    直接填寫數字，例如：2.4，若未傳值預設為 Material-UI 預設值 1.5
* */

const FEIBRoundButton = styled(MaterialIconButton).attrs({
  type: 'button',
})`
  &.MuiIconButton-root {
    width: 4rem;
    height: 4rem;
    background-color: ${({ theme }) => theme.colors.basic.white};
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.12);
    
    .MuiSvgIcon-root,
    .Icon {
      color: ${({ $iconColor, theme }) => $iconColor || theme.colors.text.dark};
      font-size: ${({ $fontSize }) => ($fontSize && `${$fontSize}rem`) || '1.6rem'};
      svg {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
      }
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.background.light};
    }
  }
`;

export default FEIBRoundButton;
