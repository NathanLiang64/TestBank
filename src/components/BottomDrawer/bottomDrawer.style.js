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
    min-height: 4.8rem;
    padding-top: 1.6rem;
    padding-bottom: 2.4rem;
    
    .title {
      font-size: 1.8rem;
      font-weight: 300;
      color: ${({ theme }) => theme.colors.primary.dark};
    }
  }
  
  .closeButton {
    position: absolute;
    top: .6rem;
    right: .8rem;
  }
  
  .content {
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


  // 搖一搖 QR Code
  &.QRCodeDrawer {
    .content {
      padding-left: 2.4rem;
      padding-right: 2.4rem;
      padding-bottom: 4rem;
      text-align: center;
      
      .cardName {
        font-size: 2rem;
        color: ${({ theme }) => theme.colors.primary.dark};
      }
      
      .accountInfo {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 1.6rem;  // 視覺對齊
        color: ${({ theme }) => theme.colors.text.darkGray};

        .account {
          font-size: 1.4rem;
          color: ${({ theme }) => theme.colors.text.light};
        }
        
        .MuiIconButton-root {
          margin-left: -.8rem;
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
        margin-top: .8rem;

        .customSpace {
          padding-bottom: 4rem;
        }
        
        .shareIconButton {
          margin-right: -.4rem;
        }
        
        .shareButtonArea {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      
      .scanArea {
        margin-top: 2.4rem;
        height: 29rem;
        border-radius: .8rem;
        overflow: hidden;

        .maskArea {
          position: absolute;
          top: 0;
          left: 0;
          display: grid;
          grid-template-rows: 1fr 20rem 1fr;
          grid-template-columns: 1fr 20rem 1fr;
          width: 100%;
          height: 100%;

          .mask {
            width: 100%;
            background: rgba(255, 255, 255, .5);

            &.empty {
              background: transparent;
            }

            .MuiSvgIcon-root {
              position: absolute;
              font-size: 4.8rem;
              color: ${({ theme }) => theme.colors.primary.light};

              &.topLeft {
                top: -1.5rem;
                left: -1.5rem;
                transform: rotate(-135deg);
              }

              &.topRight {
                top: -1.5rem;
                right: -1.5rem;
                transform: rotate(-45deg);
              }

              &.bottomLeft {
                left: -1.5rem;
                bottom: -1.5rem;
                transform: rotate(135deg);
              }

              &.bottomRight {
                right: -1.5rem;
                bottom: -1.5rem;
                transform: rotate(45deg);
              }
            }
          }
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

  // 交易明細搜尋
  &.debitInquirySearchDrawer {

    .calendarArea {
      margin-bottom: 3.4rem;
    }
    
    .dateArea {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 1.6rem;
      border-radius: 1rem;
      height: 8rem;
      background: ${({ theme }) => theme.colors.background.lighterBlue};
      
      p {
        font-size: 1.8rem;
        color: ${({ theme }) => theme.colors.primary.brand};
      }
    }
    
    .keywordArea {
      margin-bottom: 3.4rem;

      .defaultKeywords {
        margin-top: 1.6rem;
      }
    }
  }
`;

export default DrawerWrapper;
