import styled from 'styled-components';
import Layout from 'components/Layout';

const ForeignCurrencyTransferWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.lighterBlue};
  padding: 0;

  &.confirmAndResult {
    background: ${({ theme }) => theme.colors.basic.white};
    &.fail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .btnContainer {
        width: 100%;
        margin-bottom: 4rem;
      }
    }
    .line {
      height: .8rem;
      background: ${({ theme }) => theme.colors.background.lighterBlue};
    }
    .confrimDataContainer {
      padding: 2.4rem 0;
      text-align: center;
      .dataLabel {
        font-size: 1.6rem;
        color: ${({ theme }) => theme.colors.text.lightGray};
        line-height: 2.4rem;
        margin-bottom: 1.1rem;
      }
      .balance {
        font-size: 2.4rem;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.primary.dark};
        line-height: 3.6rem;
        margin-bottom: 1.2rem;
      }
      .accountInfo {
        font-size: 2.4rem;
        color: ${({ theme }) => theme.colors.primary.dark};
        line-height: 3.6rem;
        letter: 10%;
      }
    }
    .infoListContainer {
      padding: 1.6rem;
    }
    .stateContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
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

  .userCardArea {
    width: 100vw;
    padding-top: 1.6rem;
    
    .swiper-container {
      padding-bottom: 1.6rem;
    }
    
    .swiper-pagination {
      left: -.8rem;
    }
  }
  .formContainer {
    background: ${({ theme }) => theme.colors.basic.white};
    min-height: calc(100% - 20.8rem);
    padding: 2.4rem 1.6rem 0;
    border-radius: 3rem 3rem 0 0;
    .formTitle {
      font-size: 1.4rem;
      line-height: 2.1rem;
      text-align: center;
      color: ${({ theme }) => theme.colors.primary.dark};
      font-weight: 400;
      border-bottom: 2px solid ${({ theme }) => theme.colors.primary.dark};
      padding-bottom: .4rem;
      margin-bottom: 2.4rem;
    }
  }
  .btnContainer {
    margin-top: 3.6rem;
  }
  .warnText {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.dark};
    line-height: 2.1rem;
    text-align: center;
    margin-top: 1.6rem;
  }
  #balance {
    color: transparent;
  }
`;

export default ForeignCurrencyTransferWrapper;
