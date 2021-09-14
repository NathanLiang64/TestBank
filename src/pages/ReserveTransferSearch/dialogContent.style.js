import styled from 'styled-components';

const DialogContentWrapper = styled.div`
  .resultContainer {
    .stateContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 2.4rem;
      .stateImage {
        width: 14.4rem;
      }
      .stateContent {
        font-size: 2.4rem;
        font-weight: 400;
        line-height: 3.6rem;
        &.success {
          color: ${({ theme }) => theme.colors.secondary.brand};
        }
        &.fail {
          color: ${({ theme }) => theme.colors.state.error};
        }
      }
    }
    .msgLabel {
      color: ${({ theme }) => theme.colors.text.lightGray};
      text-align: center;
      margin-bottom: 1.6rem;
    }
  }
  .mainBlock {
    padding: 1.6rem 1.2rem;
    flex-direction: column;
    margin-bottom: 1.6rem;
    .dataLabel {
      font-size: 1.4rem
      line-height: 2.1rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
      margin-bottom: 1.2rem;
    }
    .balance {
      font-size: 2.4rem;
      font-weight: 600;
      line-height: 3.6rem;
      color: ${({ theme }) => theme.colors.primary.dark};
      margin-bottom: 1.2rem;
    }
    .account {
      font-size: 2.4rem;
      font-weight: 400;
      line-height: 3.6rem;
      color: ${({ theme }) => theme.colors.primary.dark};
    }
  }
`;

export default DialogContentWrapper;
