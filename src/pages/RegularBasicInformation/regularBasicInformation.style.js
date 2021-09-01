import styled from 'styled-components';
import Layout from 'components/Layout';

const RegularBasicInformationWrapper = styled(Layout)`
  .description {
    padding: 0 1.6rem;
    font-size: 1.4rem;
    line-height: 2.1rem;
    margin-bottom: 2.4rem;
  }
  &.confirmWrapper {
    padding: 0;
  }
  .section {
    padding: 1.6rem;
  }
  .line {
    height: .8rem;
    background: ${({ theme }) => theme.colors.background.lighterBlue};
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

export default RegularBasicInformationWrapper;
