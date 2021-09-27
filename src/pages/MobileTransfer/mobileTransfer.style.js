import styled from 'styled-components';
import Layout from 'components/Layout';

const MobileTransferWrapper = styled(Layout)`
  padding: 0;

  &.drawerWrapper {
    margin-top: 0;
    .formContainer {
      padding: 0 1.6rem 2.4rem;
    }
  }
  &.settingListContainer {
    padding: 2.4rem 1.6rem;
  }

  .summaryContainer {
    padding: 2.4rem 3.2rem;
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 2.1rem;
  }

  .formContainer {
    padding: 2.4rem 1.6rem;
    > p {
      font-size: 1.6rem;
      font-weight: 400;
      line-height: 2.4rem;
      margin-bottom: 1.6rem;
    }
  }

  .switchDescription {
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 2.1rem;
    color: ${({ theme }) => theme.colors.text.light};
    padding: 0 1.6rem;
  }

  .confirmDataContainer {
    padding: 1.6rem;
    &.modifyConfirmPage {
      border-bottom: none;
    }
  }

  .stateArea {
    display: flex;
    flex-direction: column;
    align-items: center;
  
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
  }

  .infoArea {
    text-align: center;
    .title {
      font-size: 1.6rem;
      line-height: 2.4rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
      margin-bottom: .8rem;
    }
    .content {
      padding: 0 3.2rem;
      color: ${({ theme }) => theme.colors.text.light};
      font-size: 1.4rem;
      line-height: 2.1rem;
      .redHighlight {
        color: ${({ theme }) => theme.colors.state.danger};
      }
    }
  }
`;

export default MobileTransferWrapper;
