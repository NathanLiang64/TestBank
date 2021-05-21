import styled from 'styled-components';
import { FormControlLabel as MaterailFormControlLabel } from '@material-ui/core';

const FEIBSwitchLabel = ({ control, label }) => (
  <FEIBSwitchFormControlLabel
    control={control}
    label={label}
    labelPlacement="start"
  />
);

/*
* ==================== FEIBＳSwitchLabel 可用選項 ====================
* 1. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為淺藍灰色
* */

const FEIBSwitchFormControlLabel = styled(MaterailFormControlLabel)`
  &.MuiFormControlLabel-root {
    height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .MuiFormControlLabel-label {
      font-size: 100%;
    }
    &.MuiFormControlLabel-labelPlacementStart {
      margin: 0 1rem;
      padding-left: 1rem;
    }
  }
`;

export default FEIBSwitchLabel;
