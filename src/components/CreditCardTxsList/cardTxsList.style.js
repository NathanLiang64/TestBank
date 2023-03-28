import styled from 'styled-components';

export const CreditCardTxsListWrapper = styled.div`

  .transactionList {
    .remark {
      button {
        padding: 0;
        margin-left: 0.5rem;
      }
    }

    .date-card-info {
      color: ${({ theme }) => theme.colors.text.light};
    }
  }
`;
