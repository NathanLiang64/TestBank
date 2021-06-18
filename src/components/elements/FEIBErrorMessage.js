import styled from 'styled-components';
import { FormHelperText as MaterialErrorMessage } from '@material-ui/core';

const FEIBErrorMessage = styled(MaterialErrorMessage).attrs({
  error: true,
})`
  &.Mui-error {
    height: 1.8rem;
    margin-bottom: 1.3rem;
    text-align: right;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.state.danger};
  }
`;

export default FEIBErrorMessage;
