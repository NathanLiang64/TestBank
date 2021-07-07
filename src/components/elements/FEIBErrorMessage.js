import styled from 'styled-components';
import { FormHelperText as MaterialErrorMessage } from '@material-ui/core';

const FEIBErrorMessage = styled(MaterialErrorMessage).attrs({
  error: true,
})`
  &.MuiFormHelperText-root {
    margin-top: .2rem;
    margin-bottom: 1.4rem;
    height: 1.8rem;
    text-align: right;
    font-size: 1.2rem;
    font-weight: 300;

    &.Mui-error {
      color: ${({ theme }) => theme.colors.state.danger};
    }
  }
`;

export default FEIBErrorMessage;
