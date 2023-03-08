import styled from 'styled-components';

export const CreditCardTxsListWrapper = styled.div`
  minheight: 20rem;

  .transactionList {
    margin-top: 0.5rem;
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
