import styled from 'styled-components';
import { Dialog as MaterialDialog } from '@material-ui/core';

const DialogWrapper = styled(MaterialDialog)`
  font-size: 1.5rem;

  .MuiPaper-root {
    border-radius: .8rem;
    width: 100%;
    
    &.MuiDialog-paperScrollPaper {
      max-height: calc(100% - 16rem);
    }
  }

  .MuiDialogTitle-root {
    padding: 4rem 2.4rem 2rem 2.4rem;
    text-align: center;

    .MuiTypography-h6 {
      font-size: 2rem;
      font-weight: 500;
    }
  }
  
  .MuiDialogContent-root {
    padding-top: 0;
    padding-bottom: 0;
    font-size: 1.5rem;
    min-height: 8.8rem;
  }

  .MuiDialogActions-root {
    justify-content: center;
    padding: 2.4rem;
  }
  
  .closeIconButton {
    position: absolute;
    top: .8rem;
    right: .8rem;
  }
`;

export default DialogWrapper;
