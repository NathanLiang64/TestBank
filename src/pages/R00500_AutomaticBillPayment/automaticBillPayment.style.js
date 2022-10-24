import styled from 'styled-components';
import Layout from 'components/Layout';

const AutomaticBillPaymentWrapper = styled(Layout)`
  .billBlock {
    margin-top: 3.6rem;
    .blockTitle {
      margin-bottom: 1.2rem;
      font-size: 1.4rem;
      font-weight: 300;
      color: ${({ theme }) => theme.colors.text.dark};
    }
    .item {
      padding: 12px;
      border-top: 0.1rem solid #ccc;
      height: 7rem;
      display: grid;
      &.noData {
        place-items: center;
        text-align: center;
        font-size: 1.6rem;
        color: ${({ theme }) => theme.colors.text.light};
      }
      &:last-child {
        border-bottom: 0.1rem solid #ccc;
      }
      .cardNum {
        font-size: 1.6rem;
      }
      .description {
        font-size: 1.2rem;
        color: ${({ theme }) => theme.colors.text.light};
      }
    }
  }
`;

export default AutomaticBillPaymentWrapper;
