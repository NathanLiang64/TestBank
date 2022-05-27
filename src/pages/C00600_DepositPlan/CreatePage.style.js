import styled from 'styled-components';

const CreatePageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  width: 100%;
  margin-bottom: 3.2rem;

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

export default CreatePageWrapper;
