import styled from 'styled-components';
import { Switch as MaterialSwitch } from '@material-ui/core';
import theme from 'themes/theme';
import { useSelector } from 'react-redux';

/*
* ==================== FEIBSwitch 可用選項 ====================
* 1. $color -> switch 顏色
*    可傳入各類型格式色碼，同步套用到 thumb, track, drop
* */
const StyledSwitch = styled(MaterialSwitch)`
  &.MuiSwitch-root {
    padding: .35rem;
    .MuiSwitch-track {
      border-radius: 1.55rem;
      background-color: #78788029;
      opacity: 1;
    }
  }
  .MuiSwitch-switchBase {
    padding: .55rem;
    .MuiSwitch-thumb{
      // background-color: ${({ $color }) => $color || theme.colors.primary.light};
      background-color: white;
      width: 2.7rem;
      height: 2.7rem;
    }
    &.Mui-checked {
      color: ${({ $color }) => $color || theme.colors.primary.light};
    }
    &.Mui-checked + .MuiSwitch-track {
      // background-color: ${({ $color }) => $color || theme.colors.primary.light};
      background-color: #34C759;
      opacity: 1;
    }
    &.Mui-disabled + .MuiSwitch-track {
      background-color: black;
      opacity: .12;
    }
  }  
`;

const FEIBSwitch = (props) => {
  const buttonDisabled = useSelector(
    (state) => state.ModalReducer.buttonDisabled,
  );
  return <StyledSwitch disabled={buttonDisabled} {...props} />;
};

export default FEIBSwitch;
