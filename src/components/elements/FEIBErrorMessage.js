import styled from 'styled-components';
import { FormHelperText as MaterialErrorMessage } from '@material-ui/core';

const FEIBErrorMessage = styled(MaterialErrorMessage).attrs({
  error: true,
})`
  &.Mui-error {
    margin-bottom: 2rem;
    text-align: right;
    color: ${({ theme }) => theme.colors.state.danger};
  }
`;

export default FEIBErrorMessage;
