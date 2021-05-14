import styled from 'styled-components';
import { Alert as MaterialAlert } from '@material-ui/lab';

const AlertWrapper = styled(MaterialAlert)`
  margin-bottom: 2rem;
  .MuiAlert-message {
    font-size: 1.4rem;
    display: inline-flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.text.dark};
  }
`;

export default AlertWrapper;
