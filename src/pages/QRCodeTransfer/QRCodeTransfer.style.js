import styled from 'styled-components';
import Layout from 'components/Layout';

const QRCodeTransferWrapper = styled(Layout)`
  .MuiTabs-root {
    width: 100%;
    margin-bottom: 0;
  }

  .MuiTabPanel-root {
    height: 88%;
  }
  
  .measuredHeight {
    display: flex;
    margin-top: 1.6rem;
    height: 100%;
    
    &.customSize {
      left: -1.6rem;
      margin-top: 0;
      height: 80%;
      width: 100vw;
      background: red;
    }
  }
  
  .contentWrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }

  .codeArea {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: .8rem;
    width: 28rem;
    height: 28rem;
    background: ${({ theme }) => theme.colors.basic.white};
    box-shadow: 0 .2rem 1.6rem rgba(0, 0, 0, .16);
  }
  
  .accountArea {
    margin-top: 2rem;
    margin-bottom: 2.4rem;
    text-align: center;
    
    p {
      margin-bottom: .4rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
    
    h3 {
      display: inline-block;
      font-size: 1.8rem;
      letter-spacing: .04rem;
      color: ${({ theme }) => theme.colors.primary.light};
    }
    
    .copyIconButtonArea {
      position: absolute;
      top: 50%;
      right: -4rem;
      transform: translateY(-50%);
    }

    .copiedMessage {
      position: absolute;
      top: 50%;
      right: -4.4rem;
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
  
  .maskArea {
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    grid-template-rows: 1fr 28rem 1fr;
    grid-template-columns: 1fr 28rem 1fr;
    width: 100%;
    height: 100%;
    
    .mask {
      width: 100%;
      background: rgba(66, 48, 99, .6);
      
      &.empty {
        background: transparent;
      }
      
      .MuiSvgIcon-root {
        position: absolute;
        font-size: 4rem;
        color: rgba(255, 255, 255, .88);
        
        &.topLeft {
          top: 0;
          left: 0;
          transform: rotate(-135deg);
        }
        
        &.topRight {
          top: 0;
          right: 0;
          transform: rotate(-45deg);
        }
        
        &.bottomLeft {
          left: 0;
          bottom: 0;
          transform: rotate(135deg);
        }
        
        &.bottomRight {
          right: 0;
          bottom: 0;
          transform: rotate(45deg);
        }
      }
    }
  }
  
  .albumArea {
    position: absolute;
    bottom: 1.6rem;
    right: 1.6rem;
    padding: .2rem;
    border-radius: .4rem;
    width: 3.2rem;
    height: 3.2rem;
    background: white;
    
    .lastPhoto {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 2.8rem;
      height: 2.8rem;
      overflow: hidden;
    }
  }
  
  .infoArea {
    margin-top: 2.4rem;
    border-radius: .8rem;
    padding: 1.6rem;
    font-size: 1.5rem;
    text-align: center;
    background: ${({ theme }) => theme.colors.background.lighter};
    
    span {
      display: inline-block;
      padding: 0 .4rem;
      color: ${({ theme }) => theme.colors.primary.brand};
    }
  }
`;

export default QRCodeTransferWrapper;
