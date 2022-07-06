import styled from 'styled-components';
import Layout from 'components/Layout';

const LoanInterestWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.lighterBlue};
  // background: ${({ theme }) => theme.colors.basic.white};
  padding: 0 1.6rem;

  .cardArea {
    width: 100vw;
    height: 14.1rem;
    transform: translateX(-1.6rem);
    padding: .8rem 1.6rem;

    .debitCard {
      margin-bottom: 0;
      box-shadow: 0px -4px 12px rgba(143, 143, 143, 0.4);
    }
  }
  

  .contentArea {
    background: ${({ theme }) => theme.colors.basic.white};
    width: 100vw;
    height: calc(100% - 14.1rem);
    overflow: auto;
    transform: translateX(-1.6rem);
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
    padding: 1.6rem 1.6rem 0;
    position: relative;

    .tools {
      background: ${({ theme }) => theme.colors.basic.white};
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .iconContainer {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 2.4rem;
    }

    .recordsList {
      .InformationTape {
        box-shadow: none;
        padding: 1.2rem 0;
        margin-bottom: 0;
      }
    }

    .detailUl {
      padding: 1.6rem;
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: .1rem solid ${({ theme }) => theme.colors.border.lightest};
        padding: 1rem 0;

        &:last-child {
          border-bottom: none;
        }
        span {
          &:first-child {
            font-size: 1.2rem;
            color: ${({ theme }) => theme.colors.primary.light};
          }
          &:last-child {
            font-size: 1.4rem;
            color: #032146;
          }
        }
      }
    }
  }

  .downloadImg {
    width: 2rem;
  }
`;

export default LoanInterestWrapper;
