import styled from 'styled-components';
import { Switch as MaterialSwitch } from '@material-ui/core';
import theme from 'themes/theme';

/*
* ==================== FEIBSwitch 可用選項 ====================
* 1. $color -> switch 顏色
*    可傳入各類型格式色碼，同步套用到 thumb, track, drop
* */
const FEIBSwitch = styled(MaterialSwitch)`
  .MuiSwitch-switchBase {
    // color: #bdbdbd;
    &.Mui-checked {
      color: ${({ $color }) => $color || theme.colors.primary.light};
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
