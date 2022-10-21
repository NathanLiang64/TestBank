import styled from 'styled-components';

const PageWrapper = styled.div`
  .friend-list {
    & > * {
      border-bottom: 1px solid ${({ theme }) => theme.colors.border.lighter};
      padding: 1.2rem 0.8rem;
      display: flex;
      // gap: 1.2rem;
    }

    & > *:first-child {
      border-top: 1px solid ${({ theme }) => theme.colors.border.lighter};
    }

    .flex-auto {
      flex: 1 1 auto;
      width: 100%;
      margin-left:1.2rem;
    }
  }

  .title {
    font-size: 1.8rem;
    line-height: 2.7rem;
  }

  .note {
    font-size: 1.2rem;
    line-height: 1.8rem;
    color: ${({ theme }) => theme.colors.text.light};

    display: flex;
    gap: 0.5em;

    & > *:not(:first-child)::before {
      content: "|";
      margin-right: 0.5em;
    }
  }
`;

export default PageWrapper;
