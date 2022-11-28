import styled from 'styled-components';

export const CreatePageWrapper = styled.div`
  margin-bottom: 3.2rem;

  .flex {
    display: flex;
    flex-direction: column;
    gap: 3.2rem;
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
    padding-block: 2rem;
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
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
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
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    margin: 2.4rem 1.6rem;
  }

  .col-2 {
    display: flex;
    gap: 1.8rem;
    width: 100%;
  }

  .w-50 {
    flex: 1 1 auto;
    width: 50%;
  }
`;

export const DetailPageWrapper = styled.div`
  padding-block: 4.4rem;

  .px-4 {
    padding-inline: 1.6rem;
  }

  .info {
    padding-block: 2.4rem;
    text-align: center;
    color: ${({ theme }) => theme.colors.text.lightGray};
  }

  .balance {
    margin-block: 1.2rem;
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
