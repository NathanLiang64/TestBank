import styled from 'styled-components';

export const CommonFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;

  // 如果使用在 RadioGroupField 時
  .MuiFormGroup-root {
    flex-direction: ${({ row }) => (row ? 'row' : 'column')};
  }
`;

export const LimitedTextWrapper = styled.span`
  display: block;
  text-align: right;
  font-size: 1.2rem;
  line-height: 1.6;
  color: ${({ showError, theme }) => (showError ? theme.colors.state.danger : theme.colors.text.dark)};
`;
