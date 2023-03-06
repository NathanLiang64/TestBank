import styled from 'styled-components';

export const CreatePageWrapper = styled.div`
  margin-bottom: 3.2rem;

  .flex {
    display: grid;
    align-content: flex-start;
    grid-gap: 2rem;
    width: 100%;
  }

  .title {
    font-size: 2.4rem;
    color: ${({ theme }) => theme.colors.text.dark};
  }

  .list-group {
    padding: 1.6rem;
  }

  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 0;
    border-top: 2px solid ${({ theme }) => theme.colors.border.lighter};

    &:first-child {
      border-top: none;
    }
  }

  .rate {
    font-size: 2.4rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.primary.brand};
  }

  .terms .collapseContent {
    display: grid;
    align-content:flex-start;
    grid-gap: 1.2rem;
    width: 100%;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.light};

    h1 {
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.text.dark};
    }

    h2 {
      color: ${({ theme }) => theme.colors.text.dark};
    }
  }
`;

export const EditPageWrapper = styled.div`
  .flex {
    display: grid;
    align-content: flex-start;
    grid-gap: 2rem;
    margin: 2.4rem 1.6rem 1rem;
  }

  .col-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1.8rem;
  }

  .amount-limit {
    font-size: 1.4rem;
  }
`;

export const DetailPageWrapper = styled.div`
  padding: 4.4rem 0;

  .px-4 {
    padding: 0 1.6rem;
  }

  .info {
    padding: 2.4rem 0;
    text-align: center;
    color: ${({ theme }) => theme.colors.text.lightGray};
  }

  .balance {
    margin: 1.2rem 0;
    font-weight: 600;
  }

  .text-primary {
    color: ${({ theme }) => theme.colors.primary.brand};
  }

  .text-lg {
    font-size: 2.4rem;
  }

  .list {
    & > * {
      border-top: 1px dashed ${({ theme }) => theme.colors.text.light};
    }
    & > *:first-child {
      border-top: none;
    }
  }

  hr {
    margin: 0;
    border: 0;
    border-top: 0.8rem solid
      ${({ theme }) => theme.colors.background.lighterBlue};
  }
`;
