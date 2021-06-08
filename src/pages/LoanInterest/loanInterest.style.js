import styled from 'styled-components';
import Layout from 'components/Layout';
// import theme from 'themes/theme';

const LoanInterestWrapper = styled(Layout)`
  .selectContainer {
    display: flex;
    justify-content: space-between;
    .picker {
      &:first-child {
        margin-right: calc(1rem + 5px);
        width: 60%;
      }
      &:last-child {
        margin-left: calc(1rem + 5px);
        width: 40%;
      }
    }
  }
  .datePickerContainer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
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
  .infoArea {
    margin-bottom: 2rem;
    text-align: left;
  }
  .resultTable {
    margin-top: 2.4rem;
  }
`;

export default LoanInterestWrapper;
