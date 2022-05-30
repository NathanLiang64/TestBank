import styled from 'styled-components';

const DetailPageWrapper = styled.div`
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
    border-top: .8rem solid ${({ theme }) => theme.colors.background.lighterBlue};
  }
`;

export default DetailPageWrapper;
