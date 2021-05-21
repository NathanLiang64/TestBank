import styled from 'styled-components';
import { Dialog as MaterialDialog } from '@material-ui/core';

const DialogWrapper = styled(MaterialDialog)`
  
  .MuiPaper-root {
    width: 100%;
  }

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
  
  .content {
    font-size: 1.5rem;
  }
  
  .alignCenter {
    justify-content: center;
    padding-bottom: 1.6rem;
  }
  
  .textColorPrimary {
    color: ${({ theme }) => theme.colors.primary.dark};
  } 
  
  .textColorPoint {
    color: ${({ theme }) => theme.colors.text.point};
  }
`;

export default DialogWrapper;
