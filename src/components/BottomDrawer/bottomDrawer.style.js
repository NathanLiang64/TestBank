import styled from 'styled-components';
import { Drawer as MaterialDrawer } from '@material-ui/core';

const DrawerWrapper = styled(MaterialDrawer).attrs({
  anchor: 'bottom',
})`
  .MuiPaper-root {
    max-height: 86vh;
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
    top: .8rem;
    left: .8rem;
  }

  .closeButton {
    top: .8rem;
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
      
      .Icon,
      .MuiSvgIcon-root,
      .MuiIcon-root {
        top: -.2rem;
        margin-right: 1.6rem;
        font-size: 2rem;
        color: ${({ theme }) => theme.colors.text.dark};
      }
    }
  }
`;

export default DrawerWrapper;
