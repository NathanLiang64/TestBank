import styled from 'styled-components';

export const TextInputFieldWrapper = styled.div`
  .balanceLayout {
    top: auto;
    bottom: 0;
  }

  .MuiFormHelperText-root.Mui-error {
    margin: 0;
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translateY(100%);
  }
`;

export const DropdownFieldWrapper = styled.div`
  .MuiFormHelperText-root.Mui-error {
    margin: 0;
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translateY(100%);
  }
`;

export const TextareaFieldWrapper = styled.div`
  textarea {
    margin-top: 0.8rem;
  }
  .limitText {
    display: block;
    text-align: right;
    font-size: 1.2rem;
    line-height: 1.6;
    color: ${({ showError, theme }) => (showError ? theme.colors.state.danger : theme.colors.text.dark)};
  }
`;

export const RadioGroupFieldWrapper = styled.div`
  .MuiFormGroup-root {
    flex-direction: ${({ row }) => (row ? 'row' : 'column')};
    .MuiFormControlLabel-root {
      margin-bottom: ${({ row }) => (row ? '0' : '1rem')};
    }
  }

  .MuiFormHelperText-root.Mui-error {
    margin: 0;
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translateY(100%);
  }
`;
