import styled from 'styled-components';
import { FormControl as MaterialFormControl } from '@material-ui/core';

const FEIBInputAnimationWrapper = styled(MaterialFormControl)`
  width: 100%;
  
  label + .MuiInput-formControl {
    margin-top: 2rem;
  }

  .MuiFormLabel-root {
    font-size: 1.4rem;

    &.Mui-focused,
    &.MuiFormLabel-filled {
      //font-size: 1.6rem;
      font-size: 1.9rem;
    }
  }
`;

export default FEIBInputAnimationWrapper;
