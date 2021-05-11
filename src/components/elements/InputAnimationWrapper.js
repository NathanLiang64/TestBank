import styled from 'styled-components';
import { FormControl as MaterialFormControl } from '@material-ui/core';

const InputAnimationWrapper = styled(MaterialFormControl)`
  width: 100%;

  .MuiFormLabel-root {
    &.Mui-focused,
    &.MuiFormLabel-filled {
      font-size: 1.4rem;
    }
  }
`;

export default InputAnimationWrapper;
