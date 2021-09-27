import styled from 'styled-components';
import { Drawer as MaterialDrawer } from '@material-ui/core';

const DrawerWrapper = styled(MaterialDrawer).attrs({
  anchor: 'bottom',
})`
  .MuiPaper-root {
    max-height: 96vh;
    overflow-y: unset;
  }
  
  .MuiDrawer-paperAnchorBottom {
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
  }
  
  .drawerTitle {
    display: flex;
    justify-content: center;
    min-height: 4.8rem;
    padding-top: 1.6rem;
    padding-bottom: 2.4rem;
    
    .title {
      font-size: 1.8rem;
      font-weight: 300;
      color: ${({ theme }) => theme.colors.primary.dark};
    }
  }
  
  .backButton,
  .closeButton {
    position: absolute;
  }
  
  .backButton {
    top: .4rem;
    left: .4rem;
  }

  .closeButton {
    top: .6rem;
    right: .8rem;
  }
  
  .content {
    overflow-y: ${({ $contentNoScrollable }) => !$contentNoScrollable && 'auto'};

    // for DebitCard more list
    li {
      border-bottom: .1rem solid ${({ theme }) => theme.colors.border.lightest};
      
      &:first-child {
        border-top: .1rem solid ${({ theme }) => theme.colors.border.lightest};
      }
      
      a, p {
        display: flex;
        align-items: center;
        padding: 2rem;
        font-size: 2rem;
        letter-spacing: .1rem;
      }
      
      .MuiSvgIcon-root,
      .MuiIcon-root {
        margin-right: 1.2rem;
        font-size: 2rem;
      }
    }
  }
`;

export default DrawerWrapper;
