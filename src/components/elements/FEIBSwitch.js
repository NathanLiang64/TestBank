import styled from 'styled-components';
import { Switch as MaterialSwitch } from '@material-ui/core';
import theme from 'themes/theme';

/*
* ==================== FEIBSwitch 可用選項 ====================
* 1. $color -> switch 顏色
*    可傳入各類型格式色碼
* */
const FEIBSwitch = styled(MaterialSwitch)`
  .MuiSwitch-switchBase {
    // color: #bdbdbd;
    &.Mui-checked {
      .MuiSwitch-thumb{
        background-color: ${({ $color }) => $color || theme.colors.primary.light};
      }
    }
    &.Mui-checked + .MuiSwitch-track {
      background-color: ${({ $color }) => $color || theme.colors.primary.light};
    }
  }  
`;

export default FEIBSwitch;
