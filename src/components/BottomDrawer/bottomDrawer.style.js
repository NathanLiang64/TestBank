import styled from 'styled-components';
import { Drawer as MaterialDrawer } from '@material-ui/core';

const DrawerWrapper = styled(MaterialDrawer).attrs({
  anchor: 'bottom',
})`

  .MuiDrawer-paperAnchorBottom {
    border-top-left-radius: 2.4rem;
    border-top-right-radius: 2.4rem;
  }
  
  .closeButton {
    display: flex;
    justify-content: flex-end;
    padding: .4rem;
  }
  
  .content {
    
    // for DebitCard more list
    li {
      border-bottom: .1rem solid ${({ theme }) => theme.colors.border.lightest};
      font-weight: bold;
      
      &:first-child {
        border-top: .1rem solid ${({ theme }) => theme.colors.border.lightest};
      }
      
      a {
        display: flex;
        align-items: center;
        padding: 1.6rem;
      }
      .MuiSvgIcon-root {
        margin-right: 1.2rem;
        font-size: 2rem;
      }
    }
  }
`;

export default DrawerWrapper;
