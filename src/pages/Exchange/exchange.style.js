import styled from 'styled-components';
import Layout from 'components/Layout';

const ExchangeWrapper = styled(Layout)`
  &.confirmPage {
    padding: .8rem 1.6rem 0rem 1.6rem;
  }
  &.finishPage {
    padding: 0 1.6rem 0rem 1.6rem;
  }
  &.confirmPage, &.finishPage {
    background: ${({ theme }) => theme.colors.background.lighterBlue};
    .infoSection {
      left: -1.6rem;
      background: white;
      width: 100vw;
      padding: 2.4rem 3.2rem;
      text-align: center;
      margin-bottom: .8rem;
      &:last-child {
        margin-bottom: 0;
      }
      .label {
        color: #666;
        font-size: 16px;
        margin-bottom: 1.2rem;
      }
      .firstData {
        color: ${({ theme }) => theme.colors.primary.dark};
        font-size: 24px;
      }
      .exchangeRate {
        margin-top: .8rem;
        font-size: 14px;
        color: ${({ theme }) => theme.colors.text.dark};
      }
      .secondData {
        display: flex;
        height: 7.5rem;
        padding-top: 1.7rem;
        font-size: 1.6rem;
        justify-content: space-between;
        border-bottom: 1px dashed ${({ theme }) => theme.colors.text.light};
        .left {
          color: #666;
        }
        .right {
          color: ${({ theme }) => theme.colors.text.dark};
        }
      }
    }
    .exchangeAccordion {
      .secondData:last-child {
        border-bottom: 0;
      }
    }
  }
  .checkImg {
    width: 17.5rem;
    height: 9rem;
    margin-bottom: 2.4rem;
  }
  table {
    margin-bottom: 2rem;
  }
  section {
    .customSize {
      min-height: unset;
      padding-left: 1.2rem;
      padding-right: 1.2rem;
      padding-bottom: .1rem;
      width: unset;
      height: 2.8rem;
      font-size: 1.4rem;
    }
  }
  ol {
    padding-left: 2.4rem;
  }
  li {
    list-style-type: decimal;
    margin-bottom: 1rem;
    &:first-child {
      color: ${({ theme }) => theme.colors.text.point};
    }
  }
  .MuiFormHelperText-root.Mui-error {
    &.balance {
      position: absolute;
      color: ${({ theme }) => theme.colors.text.dark};
      text-align: left;
      transform: translateY(calc(-100% - 3px));
    }
  }
`;

export default ExchangeWrapper;