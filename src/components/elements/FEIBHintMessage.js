import styled from 'styled-components';
import { FormHelperText as MaterialErrorMessage } from '@material-ui/core';

const FEIBHintMessage = styled(MaterialErrorMessage).attrs({})`
  &.MuiFormHelperText-root {
    margin-top: 0.2rem;
    margin-bottom: 0;
    height: 1.8rem;
    text-align: right;
    font-size: 1.2rem;
    font-weight: 300;
    // transform: translateY(-100%);

    left: 0;
    bottom: 0;
    transform: translateY(0%);
    text-align: left;

    &.Mui-error {
      color: ${({ theme }) => theme.colors.text.lightGray};
    }
  }
`;

export default FEIBHintMessage;
