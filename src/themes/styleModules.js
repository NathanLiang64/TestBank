import styled from 'styled-components';
import {
  FormControl as MaterialFormControl,
  FormControlLabel as MaterialFormControlLabel,
  InputLabel as MaterialInputLabel,
  Input as MaterialInput,
  Checkbox as MaterialCheckbox,
  IconButton as MaterialIconButton,
  InputAdornment as MaterialInputAdornment,
} from '@material-ui/core';

/* ========== Replace material-ui styles ========== */
const FormControl = styled(MaterialFormControl)`
  width: 100%;
`;

const FormControlLabel = styled(MaterialFormControlLabel)`
  color: ${({ theme }) => theme.colors.basic.white};
  opacity: .6;


  .MuiFormControlLabel-label {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.basic.white};
  }
`;

const InputLabel = styled(MaterialInputLabel)`
  color: ${({ theme }) => theme.colors.basic.white} !important;
  font-size: 1.4rem !important;
  opacity: .6;

  &.MuiFormLabel-filled,
  &.Mui-focused {
    opacity: 1;
  }
`;

const Input = styled(MaterialInput)`

  .MuiInput-input {
    padding-top: .8rem;
    padding-bottom: 1.2rem;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.basic.white};
  }
  
  &.MuiInput-underline {
    &:before,
    &:hover:not(.Mui-disabled):before {
        border-color: ${({ theme }) => theme.colors.basic.white};
      opacity: .6;
    }
    &:after {
        border-color: ${({ theme }) => theme.colors.basic.white};
    }
  }
`;

const Checkbox = styled(MaterialCheckbox)`
  //&.MuiButtonBase-root,
  // &.MuiCheckbox-colorSecondary.Mui-checked {
  // }
  &.MuiCheckbox-root {
     color: ${({ theme }) => theme.colors.basic.white};
  }
`;

const IconButton = styled(MaterialIconButton)`
  
  &.MuiIconButton-root {
    color: ${({ theme }) => theme.colors.basic.white};
    opacity: .6;
  }
`;

const InputAdornment = styled(MaterialInputAdornment)`
  
`;

export {
  // eslint-disable-next-line import/prefer-default-export
  FormControl,
  FormControlLabel,
  InputLabel,
  Input,
  Checkbox,
  IconButton,
  InputAdornment,
};
