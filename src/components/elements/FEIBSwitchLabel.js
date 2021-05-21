import styled from 'styled-components';
import { FormControlLabel as MaterialFormControlLabel } from '@material-ui/core';

/*
* ==================== FEIBSwitchLabel 可用選項 ====================
* */
const FEIBSwitchLabel = styled(MaterialFormControlLabel).attrs({
  labelPlacement: 'start',
})`
  color: ${({ theme, $color }) => $color || theme.colors.text.light};
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
