import styled from 'styled-components';
import { FormControlLabel as MaterialFormControlLabel } from '@material-ui/core';

/*
* ==================== FEIBSwitchLabel 可用選項 ====================
* 1. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為淺藍灰色
* 2. $bgColor -> 背景顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為透明
* 3. $hasBorder -> 邊框
*    預設無邊框，加上此參數則會顯示下邊框，若有多個 Label 時則只有第一個 Label 上下皆有邊框
* */
const FEIBSwitchLabel = styled(MaterialFormControlLabel).attrs({
  labelPlacement: 'start',
})`
  left: -3.2rem;
  padding: 0 .8rem 0 1.6rem;
  border-bottom: ${({ theme, $hasBorder }) => ($hasBorder ? `.1rem solid ${theme.colors.border.lighter}` : '0')};
  width: 100vw;
  color: ${({ theme, $color }) => $color || theme.colors.text.light};
  background: ${({ $bgColor }) => $bgColor || 'transparent'};
  
  &:first-child {
    border-top: ${({ theme, $hasBorder }) => ($hasBorder ? `.1rem solid ${theme.colors.border.lighter}` : '0')};
  }
  
  &.MuiFormControlLabel-root {
    height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .MuiFormControlLabel-label {
      font-size: 100%;
    }

    &.MuiFormControlLabel-labelPlacementStart {
      //margin: 0 1rem;
      //padding-left: 1rem;
    }
  }
`;

export default FEIBSwitchLabel;
