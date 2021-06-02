import styled from 'styled-components';
import { Drawer as MaterialDrawer } from '@material-ui/core';

const DrawerWrapper = styled(MaterialDrawer).attrs({
  anchor: 'bottom',
})`
  .MuiDrawer-paperAnchorBottom {
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
    overflow-x: hidden;
  }
  
  .drawerTitle {
    display: flex;
    justify-content: center;
    padding: .8rem;
    font-size: 2rem;
    font-weight: 500;
    height: 4.6rem;
  }
  
  .closeButton {
    position: absolute;
    top: 0;
    right: 0;
  }
  
  .content {
    
    // for DebitCard more list
    li {
      border-bottom: .1rem solid ${({ theme }) => theme.colors.border.lightest};
      
      &:first-child {
        border-top: .1rem solid ${({ theme }) => theme.colors.border.lightest};
      }
      
      a {
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
  
  &.QRCodeDrawer {
    .content {
      padding: 0 2.4rem;
      text-align: center;
      font-weight: 500;
      
      .cardName {
        color: ${({ theme }) => theme.colors.primary.light};
      }
      
      .accountInfo {
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${({ theme }) => theme.colors.text.darkGray};

        .account {
          font-size: 1.5rem;
          color: ${({ theme }) => theme.colors.text.lightGray};
        }
        
        .MuiIconButton-root {
          margin-left: -.4rem;
        }

        .copiedMessage {
          position: absolute;
          top: 50%;
          right: -112%;
          padding: .2rem .4rem;
          font-size: 1.2rem;
          border-radius: .4rem;
          background: ${({ theme }) => theme.colors.background.mask};
          color: ${({ theme }) => theme.colors.basic.white};
          transform: translateY(-50%);
          transition: all .2s;
          opacity: 0;

          &.showMessage {
            opacity: 1;
          }
        }
      }
      
      .codeArea {
        margin: 1.6rem 0;

        .customSpace {
          padding-bottom: 4rem;
        }
        
        .shareIconButton {
          position: absolute;
          right: 0;
          bottom: -.4rem;
        }
      }
      
      .buttonArea {
        padding: 2rem 0;
        border-top: .1rem solid ${({ theme }) => theme.colors.border.lighter};
        width: 100%;
      }
      
      .loadingArea {
        padding: 4rem 0;
      }
    }
  }
`;

export default DrawerWrapper;
