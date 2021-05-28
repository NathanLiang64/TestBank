import styled from 'styled-components';
import Layout from 'components/Layout';
import theme from 'themes/theme';

const LoanInterestWrapper = styled(Layout)`
  .datePickerContainer {
    display: flex;
    justify-content: space-between;
    .picker {
      width: 50%;
      &:first-child {
        margin-right: calc(1rem + 5px);
      }
      &:last-child {
        margin-left: calc(1rem + 5px);
      }
    }
    .MuiFormControl-root {
      width: 50%;
      &:first-child {
        margin-right: 1rem;
      }
      &:last-child {
        margin-left: 1rem;
      }
    }
  }
  .point {
    color: ${theme.colors.text.point};
    transform: translateY(-1rem);
  }
  .resultTable {
    margin-top: 2.4rem;
  }
`;

export default LoanInterestWrapper;
