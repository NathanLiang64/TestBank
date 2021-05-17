import styled from 'styled-components';
import { Dialog as MaterialDialog } from '@material-ui/core';

const DialogWrapper = styled(MaterialDialog)`

  .MuiDialogActions-root {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
  }
  
  .title {
    .MuiTypography-h6 {
      font-size: 1.6rem;
      font-weight: bold;
    }
  }
  
  .alignCenter {
    justify-content: center;
    padding-bottom: 1.6rem;
  }
`;

export default DialogWrapper;
