import styled from 'styled-components';
import { Dialog } from '@material-ui/core';

const SnackModalDialogWrapper = styled(Dialog)`

  .MuiBackdrop-root {
    background: transparent !important;
    backdrop-filter: unset;
  }
  
  .MuiDialogTitle-root {
    padding: 0;
  }
`;

const SnackModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: .8rem;
  width: 16rem;
  padding: 1.6rem 0;
  text-align: center;
  background: ${({ theme }) => theme.colors.primary.light};
  box-shadow: 0 .4rem 1rem rgba(0, 0, 0, .12);
  animation: fadeIn ease-out .2s, fadeOut .2s ease-out 1.4s;
  z-index: 10;

  .MuiSvgIcon-root {
    margin-bottom: .4rem;
    font-size: 3.2rem;
    color: ${({ theme }) => theme.colors.basic.white};
  }

  .displayMessage {
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.basic.white};
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

export default SnackModalWrapper;
export { SnackModalDialogWrapper };
