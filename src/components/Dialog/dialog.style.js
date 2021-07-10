import styled from 'styled-components';
import { Dialog as MaterialDialog } from '@material-ui/core';

const DialogWrapper = styled(MaterialDialog)`
  font-size: 1.5rem;

  .MuiPaper-root {
    margin: 2.4rem;
    border-radius: .8rem;
    width: 100%;
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
    padding-bottom: 0rem;
    font-size: 1.5rem;
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
