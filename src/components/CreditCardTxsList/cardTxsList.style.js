import styled from 'styled-components';

export const CreditCardTxsListWrapper = styled.div`
  minheight: 20rem;

  .transactionList {
    margin-top: 0.5rem;
    .remark {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      button {
        padding: 0;
      }
    }

    .date-card-info {
      color: ${({ theme }) => theme.colors.text.light};
    }
  }
`;
