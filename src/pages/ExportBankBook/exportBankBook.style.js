import styled from 'styled-components';
import Layout from 'components/Layout';

const ExportBankBookWrapper = styled(Layout)`
  .datePickerContainer {
    padding-left: 2.8rem;
    .Mui-error {
      margin-bottom: 0;
    }
    .tip {
      font-size: 1.4rem;
      margin-bottom: 1.6rem;
    }
    .rangeBtnContainer {
      display: flex;
      justify-content: space-between;
      .customSize {
        min-height: unset;
        padding-left: 1.2rem;
        padding-right: 1.2rem;
        padding-bottom: .1rem;
        width: unset;
        height: 2.8rem;
        font-size: 1.4rem;
        margin: unset;
      }
    }
  }
  .stateArea {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2.4rem;

    .stateContent {
      text-align: center;
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
    }
  }
`;

export default ExportBankBookWrapper;
