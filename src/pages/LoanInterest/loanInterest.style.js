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
    margin-bottom: 2rem;
  }
  .infoArea {
    margin-bottom: 2rem;
    text-align: left;
  }
  form {
    margin-bottom: 1rem;
  }
`;

export default LoanInterestWrapper;
