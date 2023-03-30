import styled from 'styled-components';
import { FormHelperText as MaterialErrorMessage } from '@material-ui/core';

const FEIBHintMessage = styled(MaterialErrorMessage).attrs({})`
  &.MuiFormHelperText-root {
    font-size: 1.2rem;
    font-weight: 300;
    text-align: left;

    &.Mui-error {
      color: ${({ theme }) => theme.colors.text.lightGray};
    }
  }
`;

export default FEIBHintMessage;
