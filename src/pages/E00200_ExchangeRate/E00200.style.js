import styled from 'styled-components';
import Layout from 'components/Layout';

const ExchangeRateWrapper = styled(Layout)``;

export const ExchangeTableWrapper = styled.div`
  .describe {
    h2 {
      font-size: 1.4rem;
      line-height: 2.1rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }
  table {
    thead {
      border-bottom: 1px solid ${({ theme }) => theme.colors.border.lightest};

      tr {
        td {
          text-align: right;
          font-size: 1.4rem;
          line-height: 1.8rem;
          color: ${({ theme }) => theme.colors.primary.light};
          &:first-child {
            text-align: left;
          }
        }
      }
    }
    tbody {
      tr {
        td {
          text-align: right;
          font-size: 1.4rem;
          line-height: 2.1rem;
          color: ${({ theme }) => theme.colors.text.dark};
          &:first-child {
            text-align: left;
          }
        }
      }
    }
  }
`;

export default ExchangeRateWrapper;
