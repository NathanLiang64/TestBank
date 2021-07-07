import styled from 'styled-components';
import { Dialog as MaterialDialog } from '@material-ui/core';

const BankCodeWrapper = styled(MaterialDialog)`
  
  .MuiPaper-root {
    max-width: unset;
    max-height: unset;
    margin: 0;
    width: 100vw;
    height: 100vh;
  }
  
  .MuiDialogTitle-root {
    padding: 0;
    height: 4.4rem;
    
    .MuiTypography-root {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    
    .title {
      font-size: 1.8rem;
      font-weight: 300;
    }

    .closeButton {
      position: absolute;
      top: 0;
      right: .2rem;
    }
  }
  
  .MuiDialogContent-root {
    padding: 0;
    
    ul li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 1.6rem;
      padding: 0 .8rem;
      border-bottom: .1rem solid ${({ theme }) => theme.colors.border.lighter};
      height: 5.5rem;
      color: ${({ theme }) => theme.colors.text.dark};
      
      &:first-child {
        margin: 0;
        padding: 0 1.6rem;
        border-bottom: 0;
        height: 4.6rem;
        background: ${({ theme }) => theme.colors.background.lighterBlue};
      }
      
      &:last-child {
        border-bottom: 0;
      }
    }
    
    .searchCodeArea {
      padding: 2.4rem 1.6rem;
    }
  }
`;

export default BankCodeWrapper;
