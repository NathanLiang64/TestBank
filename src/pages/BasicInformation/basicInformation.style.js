import styled from 'styled-components';
import Layout from 'components/Layout';

const BasicInformationWrapper = styled(Layout)`
  .selectContainer {
    display: flex;
    div {
      width: 100%;
      flex-grow: 1;
      &:first-child {
        margin-right: 1rem;
      }
      &:last-child {
        margin-left: 1rem;
      }
    }
  }
  .stateArea {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2.4rem;
  
    .stateImage {
      width: 14.4rem;
    }

    .stateText {
      font-size: 2.4rem;
      text-align: center;
      font-weight: 500;
      margin-bottom: 2.4rem;

      &.success {
        color: ${({ theme }) => theme.colors.secondary.brand};
      }
      &.error {
        color: ${({ theme }) => theme.colors.state.error};
      }
    }

    .stateContent {
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
    }
  }
`;

export default BasicInformationWrapper;
