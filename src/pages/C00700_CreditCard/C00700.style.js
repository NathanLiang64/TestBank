import styled from 'styled-components';

export const DetailDialogContentWrapper = styled.div`
  .panel {
    padding-top: .8rem;
    padding-bottom: 1.6rem;
  }
`;

export const CreditCardTxsListWrapper = styled.div`
  padding: 0 1rem;
`;

export const TableDialog = styled.div`
  text-align: center;
  table {
    font-size: 1.2rem;

    thead {
      border-bottom: 0.1rem solid #f3f3f3;

      tr th {
        padding-top: 0.6rem;
        padding-bottom: 0.8rem;
        font-weight: 500;
        width: 33.333333%;
        font-size: 1.4rem;
      }
    }
    tbody tr th {
      width: 33.333333%;
      padding-top: 0.4rem;
      padding-bottom: 0.4rem;
      font-size: 1.4rem;
    }
  }

  .remark {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.light};
    font-size: 1.4rem;
    text-align: left;
    display: flex;
    padding-top: 0.4rem;
  }
`;

export const InfoPageWrapper = styled.div`
  padding-top: 5.2rem;

  .heading {
    font-size: 1.8rem;
    margin-top: 1.6rem;
  }

  hr {
    border: none;
  }

  .mb-4 {
    margin-top: 1.6rem;
    margin-bottom: 3.2rem;
  }  
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1.6rem ;
`;

export const RewardPageWrapper = styled.div`
  display: grid;
  align-content: flex-start;
  grid-gap: 1.6rem;
  padding-bottom: 6rem;

  .table {
    margin-top: 3rem;

    th {
      color: ${({ theme }) => theme.colors.primary.light};
      text-align: left;
      font-size: 1.2rem;
    }

    tr > *:nth-child(2) {
      text-align: right;
    }

    td {
      height: 4.5rem;
      font-size: 1.6rem;
    }

    tr > td:nth-child(2) {
      font-size: 1.8rem;
    }

    .w-1/4 {
      width: 25%;
    }
    .w-3/4 {
      width: 75%;
    }

    tbody > tr {
      border: 0;
    }
  }

  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border.lightest};
    width: 100%;
  }

  .font-14 {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.light};
  }

  .mb-6 {
    margin-bottom: 3rem;
  }
`;

// export default SwiperCreditCard;
